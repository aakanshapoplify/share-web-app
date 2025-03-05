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
interface Props {
  addonsData: AddonsProps[];
  handleAddons: (data: any,type:string) => void;
}

const Addons = ({ addonsData,handleAddons }: Props) => {
  const [selectedOptions, setSelectedOptions] = useState<Options[]>([]);
  const [textResponses, setTextResponses] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    const multiSelectOptions = addonsData
      .filter((addon) => addon.field_type === "MULTI_SELECT")
      .flatMap((addon) =>
        addon.options.map((option) => ({ ...option, selected: 0 }))
      );
    setSelectedOptions(multiSelectOptions);

    // Initialize text responses with event_addon_id as key
    const initialTextResponses = addonsData
      .filter((addon) => addon.field_type === "TEXT_RESPONSE")
      .reduce((acc, addon) => {
        acc[addon.event_addon_id] = "";
        return acc;
      }, {} as { [key: string]: string });

    setTextResponses(initialTextResponses);
  }, [addonsData]);

  const updateTicketCount = (ticketId: string, change: number) => {
    setSelectedOptions((prev) =>
      prev.map((option) =>
        option.addon_option_id === ticketId
          ? { ...option, selected: Math.max(0, option.selected + change) }
          : option
      )
    );
  };

  const handleTextChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    addonId: string
  ) => {
    const text = event.target.value;
    if (text.length <= 200) {
      setTextResponses((prev) => ({
        ...prev,
        [addonId]: text,
      }));
    }
  };
  const handleProceed = async () => {
    let errorMessages: string[] = [];
    const textResponsesData = addonsData
      .filter((addon) => addon.field_type === "TEXT_RESPONSE")
      .map((addon) => {
        const value = textResponses[addon.event_addon_id] || "";
        if (addon.mandatory && !value.trim()) {
          errorMessages.push(`Text field is required.`);
        }
        return {
          event_addon_id: addon.event_addon_id,
          field_type: addon.field_type,
          value,
        };
      });
 // Validate multi-select options
    const multiSelectData = addonsData
      .filter((addon) => addon.field_type === "MULTI_SELECT")
      .map((addon) => {
        const selectedOptionsList = selectedOptions
          .filter((option) => addon.options.some((opt) => opt.addon_option_id === option.addon_option_id))
          .map((option) => ({
            addon_option_id: option.addon_option_id,
            selected: option.selected,
          }));

        if (addon.mandatory && selectedOptionsList.every((opt) => opt.selected === 0)) {
          errorMessages.push(`- Please select at least one option`);
        }

        return {
          event_addon_id: addon.event_addon_id,
          field_type:addon.field_type,
          options: selectedOptionsList,
        };
      });

    if (errorMessages.length > 0) {
      toast.error(`Please fill the required fields`);
      return;
    }
    const requestData = {
          addons: [...textResponsesData, ...multiSelectData],
        }
    
    await handleAddons(requestData.addons,"addons")
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
              {addonsData?.map((item, index) => (
                <div key={index}>
                  {/* TEXT RESPONSE FIELD */}
                  {item.field_type === "TEXT_RESPONSE" && (
                    <div className="mb-4">
                      <label className={classes.card_title}>
                        {item.question}
                        {item.mandatory && (
                          <small className={classes.mandatoryIcon}>*</small>
                        )}
                      </label>
                      <textarea
                        className={classNames(
                          classes.addon_textarea,
                          "form-control"
                        )}
                        id={`addon-textarea-${item.event_addon_id}`}
                        maxLength={200}
                        rows={4}
                        value={textResponses[item.event_addon_id] || ""}
                        onChange={(e) =>
                          handleTextChange(e, item.event_addon_id)
                        }
                      ></textarea>
                      <small>
                        {textResponses[item.event_addon_id]?.length || 0} / 200
                      </small>
                    </div>
                  )}

                  {/* MULTI SELECT FIELD */}
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
                                <tr key={optIndex} className={classes.table_tr}>
                                  <td className="tb-name">
                                    <p className={classes.wrap_text}>
                                      {data.name}
                                    </p>
                                  </td>
                                  <td>
                                    <p>
                                      {data.currency}
                                      {data.price}
                                    </p>
                                    {data.price === 0 && <p>Free</p>}
                                  </td>
                                  <td className={classes.table_td}>
                                    <div className={classes.button}>
                                      <span
                                        className={classNames(
                                          classes.pointer,
                                          "decrement-btn"
                                        )}
                                        onClick={() =>
                                          updateTicketCount(
                                            data.addon_option_id,
                                            -1
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
                                            1
                                          )
                                        }
                                      >
                                        <i className="bi bi-plus-circle-fill"></i>
                                      </span>
                                    </div>
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
