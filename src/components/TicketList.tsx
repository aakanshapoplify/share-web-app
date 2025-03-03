import classes from "./styles/eventCard.module.css";
import { useState, useEffect, useRef } from "react";
import classNames from "classnames";

interface Ticket {
  ticket_id: string;
  name: string;
  description: string;
  price: number;
  remaining: number;
  selected: number;
}

interface Event {
  free: boolean;
  currency_symbol: string;
}

interface Props {
  tickets: Ticket[];
  event: Event;
  isDisable: boolean;
  handleTickets: (data: any[],type:string) => void;
}

const TicketList = ({ tickets, event, handleTickets, isDisable }: Props) => {
  const [ticketListing, setTicketListing] = useState<Ticket[]>(tickets);
  const [eventRecord, setEventRecord] = useState<Event>(event);
  const isFirstRender = useRef(true);

  const updateTicketCount = (ticketId: string, change: number) => {
    setTicketListing((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.ticket_id === ticketId
          ? { ...ticket, selected: Math.max(0, ticket.selected + change) }
          : ticket
      )
    );
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const selectedData = ticketListing.map(({ ticket_id, selected }) => ({
      ticket_id,
      selected,
    }));

    if (
      JSON.stringify(selectedData) !==
      JSON.stringify(
        tickets.map(({ ticket_id, selected }) => ({ ticket_id, selected }))
      )
    ) {
      handleTickets(selectedData,"ticket");
    }
  }, [ticketListing]);

  return (
    <div className="mt-4">
      <h5 className={classes.event_name}>Get your tickets!</h5>
      <div className="row">
        {ticketListing?.map((item) => (
          <div key={item.ticket_id} className="col-md-12">
            <div
              className={classNames(
                classes.card_start,
                "card",
                classes.spacing
              )}
            >
              <div className={classNames(classes.card_body, classes.card_btn)}>
                <p className={classes.card_title}>
                  <span>{item.name}</span>
                </p>
                <p className={classes.desc_card}>
                  <span>{item.description}</span>
                </p>
                <div className={classes.cards_btn}>
                  {eventRecord.free ? (
                    <p className={classes.card_title}>
                      <span>Free</span>
                    </p>
                  ) : (
                    <p className={classes.card_title}>
                      <span>
                        {eventRecord.currency_symbol}
                        {item.price}
                      </span>
                    </p>
                  )}

                  {item.remaining === 0 ? (
                    <div className={classes.button}>
                      <a className={classes.decorator}>Sold out</a>
                    </div>
                  ) : (
                    <div className={classes.button} id="tickets-container">
                      <span
                        className="m-2 decrement-btn"
                        onClick={() =>
                          !isDisable &&
                          item.selected > 0 &&
                          updateTicketCount(item.ticket_id, -1)
                        }
                        style={{ cursor: isDisable ? "" : "pointer" }}
                      >
                        <i className="bi bi-dash-circle-fill"></i>
                      </span>

                      <span className={classes.quantity_display}>
                        {item.selected}
                      </span>

                      <span
                        className="m-2 increment-btn"
                        onClick={() =>
                          !isDisable && updateTicketCount(item.ticket_id, 1)
                        }
                        style={{ cursor: isDisable ? "" : "pointer" }}
                      >
                        <i className="bi bi-plus-circle-fill"></i>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketList;
