import React, { useState } from "react";
import classes from "./addons.module.css";
import classNames from "classnames";

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
}

const Addons = ({ addonsData }: Props) => {
  const [addonsOptionId, setAddonsOptionId ] = useState<Options[]>();
  const updateTicketCount = (ticketId: string, change: number) => {
    setAddonsOptionId((prevTickets) =>
      prevTickets?.map((ticket) =>
        ticket.addon_option_id === ticketId
          ? { ...ticket, selected: Math.max(0, ticket.selected + change) }
          : ticket
      )
    );
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
                  {item?.field_type == "TEXT_RESPONSE" && (
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
                        id={`addon-textarea-${index}`}
                        maxLength={200}
                      ></textarea>
                      <small
                      >
                        200
                      </small>
                    </div>
                  )}
                  {item?.field_type == "MULTI_SELECT" && (
                    <>
                      {item?.options?.length > 0 && (
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
                                {item.options.map((data, optIndex) => (
                                  <tr key={optIndex}>
                                    <td className="tb-name">
                                      <p className={classes.wrap_text}>{data.name}</p>
                                    </td>
                                    <td>
                                      <p>
                                        {data.currency}
                                        {data.price}
                                      </p>
                                      {data.price === 0 && <p>Free</p>}
                                    </td>
                                    <td>
                                      <div
                                        className={classes.button}
                                        id="tickets-container"
                                      >
                                        <span
                                          className="m-2 decrement-btn"
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
                                          className={classes.quantity_display}
                                        >
                                          {data.selected}
                                        </span>

                                        <span
                                          className="m-2 increment-btn"
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
                    </>
                  )}
                </div>
              ))}

              {/* Proceed Button */}
              <button
                type="submit"
                className={classNames(classes.btn_apply, "btn", "btn-dark")}
              >
                Proceed to Next Step
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Addons;
