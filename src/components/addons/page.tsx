import { useState, useEffect } from "react";
import classes from "./addons.module.css";
import classNames from "classnames";
import { toast } from "react-toastify";

interface Options {
  name: string;
  addon_option_id: string;
  currency: string;
  selected: number;
  quantity: number;
  price: number;
}
interface AddonsProps {
  event_addon_id: string;
  question: string;
  value: string;
  mandatory: boolean;
  paid: boolean;
  field_type: string;
  options: Options[];
}
interface props {
  total: string;
  currency_symbol: string;
  booking_fee: string;
  addons: AddonsProps[];
}

interface Props {
  paymentObject:any;
  addonsData: AddonsProps[];
  handleAddons: (data: any[], type: string) => void;
  processToNext: (type: string) => void;
}

const Addons = ({ addonsData, handleAddons, processToNext,paymentObject }: Props) => {
  const [addons, setAddons] = useState<AddonsProps[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Options[]>([]);
  const [textResponses, setTextResponses] = useState<{ [key: string]: string }>(
    {}
  );
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [updatedAddons, setUpdatedAddons] = useState<any[]>([]);

  useEffect(() => {
    if (!addonsData || addonsData.length === 0) return;

    setAddons(addonsData);

    setSelectedOptions((prevSelectedOptions) => {
      const newSelectedOptions = addonsData
        .filter((addon) => addon.field_type === "MULTI_SELECT")
        .flatMap((addon) =>
          addon.options.map((option) => {
            const existingOption = prevSelectedOptions.find(
              (prev) => prev.addon_option_id === option.addon_option_id
            );
            return existingOption ? existingOption : { ...option, selected: 0 };
          })
        );
      return newSelectedOptions;
    });

    const initialTextResponses = addonsData
      .filter((addon) => addon.field_type === "TEXT_RESPONSE")
      .reduce((acc, addon) => {
        acc[addon.event_addon_id] = textResponses[addon.event_addon_id] || "";
        return acc;
      }, {} as { [key: string]: string });

    setTextResponses(initialTextResponses);
  }, [addonsData]);
  const updateTicketCount = (
    ticketId: string,
    change: number,
    event_addon_id: string,
    quantity: number
  ) => {
    setSelectedOptions((prev) => {
      let hasChanged = false; // Track if any update happened

      const updatedOptions = prev?.map((option) => {
        if (option.addon_option_id === ticketId) {
          const newCount = option.selected + change;

          if (newCount > quantity) {
            alert("You cannot select more than the allowed quantity.");
            return option; // Prevent update
          }
          if (newCount < 0) {
            return option; // Prevent negative values
          }

          hasChanged = true; // Mark that a valid change occurred
          return { ...option, selected: Math.max(0, newCount) };
        }
        return option;
      });

      if (!hasChanged) {
        return prev; // Prevent reset if no valid change
      }

      const multiSelectData = addons
        .filter(
          (addon) =>
            addon.field_type === "MULTI_SELECT" &&
            addon.event_addon_id === event_addon_id
        )
        .map((addon) => ({
          event_addon_id: addon.event_addon_id,
          field_type: addon.field_type,
          options: updatedOptions
            ?.filter((option) =>
              addon.options.some(
                (opt) => opt.addon_option_id === option.addon_option_id
              )
            )
            ?.map((option) => ({
              addon_option_id: option.addon_option_id,
              selected: option.selected,
            })),
        }));

      const textResponseData = addons
        .filter((addon) => addon.field_type === "TEXT_RESPONSE")
        .map((addon) => ({
          event_addon_id: addon.event_addon_id,
          field_type: addon.field_type,
          value: textResponses[addon.event_addon_id] || "",
        }));

      setUpdatedAddons([...multiSelectData, ...textResponseData]);

      return updatedOptions;
    });
  };

  useEffect(() => {
    if (updatedAddons.length > 0) {
      handleAddons(updatedAddons, "addons");
    }
  }, [updatedAddons]);

  const handleTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    addonId: string
  ) => {
    setTextResponses((prev) => ({
      ...prev,
      [addonId]: event.target.value,
    }));
  };

  const handleProceed = async () => {
    let errorMessages: string[] = [];
    const currentFieldType = addons[currentFieldIndex]?.field_type;

    let requestData: any[] = [];

    if (currentFieldType === "TEXT_RESPONSE") {
      requestData = addons
        .filter((addon) => addon.field_type === "TEXT_RESPONSE")
        .map((addon) => {
          const value = textResponses[addon.event_addon_id] || "";
          if (addon.mandatory && !value.trim()) {
            errorMessages.push(`- ${addon.question} is required`);
          }
          return {
            event_addon_id: addon.event_addon_id,
            field_type: addon.field_type,
            value,
          };
        });
    }

    if (currentFieldType === "MULTI_SELECT") {
      processToNext("netProcess");
      addons
        .filter((addon) => addon.field_type === "MULTI_SELECT")
        .forEach((addon) => {
          const selectedOptionsList = selectedOptions
            .filter((option) =>
              addon.options.some(
                (opt) => opt.addon_option_id === option.addon_option_id
              )
            )
            .map((option) => ({
              addon_option_id: option.addon_option_id,
              selected: option.selected,
            }));

          if (
            addon.mandatory &&
            selectedOptionsList.every((opt) => opt.selected === 0)
          ) {
            errorMessages.push(
              `- Please select at least one option for ${addon.question}`
            );
          }
        });
    }

    if (errorMessages.length > 0) {
      toast.error(errorMessages.join("\n"));
      return;
    }

    if (currentFieldType === "TEXT_RESPONSE") {
      await handleAddons(requestData, "addons");
    }

    if (currentFieldIndex < addons.length - 1) {
      setCurrentFieldIndex((prev) => prev + 1);
    }
  };

  return (
    <div
      className={classNames(
        classes.addons_div,
        classes.event_detail,
        "container",
        "mt-4"
      )}
      id="addonSelection"
    >
      <div className="row">
        <h5 className={classes.event_name}>Buy Tickets</h5>
        <div className="col-md-12">
          <div className={classNames(classes.addonCard_start, "card")}>
            <div className="card-body">
              {addons
                ?.filter(
                  (item) =>
                    item.field_type === addons[currentFieldIndex]?.field_type
                )
                ?.map((item, index) => (
                  <div key={index}>
                    {item.field_type === "TEXT_RESPONSE" && (
                      <div className="mb-4">
                        <label className={classes.card_title}>
                          {item?.question}
                          {item?.mandatory && (
                            <small className={classes.mandatoryIcon}>*</small>
                          )}
                        </label>
                        <textarea
                          className={classNames(
                            classes.addon_textarea,
                            "form-control"
                          )}
                          maxLength={200}
                          rows={4}
                          value={textResponses[item.event_addon_id] || ""}
                          onChange={(e) =>
                            handleTextChange(e, item.event_addon_id)
                          }
                        ></textarea>
                        <small>
                          {textResponses[item.event_addon_id]?.length || 0} /
                          200
                        </small>
                      </div>
                    )}

                    {item.field_type === "MULTI_SELECT" &&
                      item.options.length > 0 && (
                        <div>
                          <p className={classes.card_title}>
                            {item.question}
                            {item.mandatory && (
                              <small className={classes.mandatoryIcon}>*</small>
                            )}
                          </p>
                          <div className={classes.table_responsive}>
                            <table className="table">
                              <tbody>
                                {selectedOptions.map((data, optIndex) => (
                                  <tr
                                    key={optIndex}
                                    className={classes.table_tr}
                                  >
                                    <td className="tb-name">
                                      {" "}
                                      <p className={classes.wrap_text}>
                                        {data.name}
                                      </p>
                                    </td>
                                    <td>
                                      {data.price > 0 ? (
                                        <p>
                                          {data.currency}
                                          {data.price}
                                        </p>
                                      ) : (
                                        <p>Free</p>
                                      )}
                                    </td>
                                    <td>
                                      <span
                                        className={classNames(
                                          classes.pointer,
                                          "decrement-btn"
                                        )}
                                        onClick={() =>
                                          updateTicketCount(
                                            data.addon_option_id,
                                            -1,
                                            item.event_addon_id,
                                            data.quantity
                                          )
                                        }
                                      >
                                        <i className="bi bi-dash-circle-fill"></i>
                                      </span>
                                      <span
                                        className={classNames(
                                          classes.quantity_display,
                                          "ms-2",
                                          "me-2"
                                        )}
                                      >
                                        {data.selected}
                                      </span>
                                      <span
                                        className={classNames(
                                          classes.pointer,
                                          "increment-btn"
                                        )}
                                        onClick={() =>
                                          updateTicketCount(
                                            data.addon_option_id,
                                            1,
                                            item.event_addon_id,
                                            data.quantity
                                          )
                                        }
                                      >
                                        <i className="bi bi-plus-circle-fill"></i>
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              {paymentObject?.total > 0 &&
                <div className={classNames("mb-1",classes.amount )} id="amount-div">
                <small>Booking fees: {paymentObject?.currency_symbol} {parseFloat(paymentObject?.booking_fee)?.toFixed(2)}</small>
                <p className="card-title"> <span id="total-amount">{paymentObject?.currency_symbol} {parseFloat(paymentObject?.total)?.toFixed(2)}</span></p>
               </div>
                 }

              {/* Proceed Button */}
              <div className="col-12 mt-2 mt-sm-0">
                <button
                  type="button"
                  className={classNames(classes.menu_btn, "btn", "btn-dark")}
                  onClick={handleProceed}
                >
                  Proceed to Next Step
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addons;
