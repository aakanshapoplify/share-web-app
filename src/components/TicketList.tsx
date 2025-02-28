import { useState } from "react";
import classNames from "classnames";
import classes from "./styles/eventCard.module.css"
import { useEffect } from "react";

interface Ticket {
  ticket_id: string;
  name: string;
  description: string;
  price: number;
  remaining: number;
}

interface Event {
  free: boolean;
  currency_symbol: string;
}
interface Props {
    tickets:Ticket[];
    event:Event;
    handleTickets:(data:any)=>void;
}

const TicketList = ({ tickets, event,handleTickets }: Props) => {
  const [selectedTickets, setSelectedTickets] = useState<{ ticket_id: string; count: number }[]>([]);
  const [ticketListing, setTicketListing] = useState(tickets)
  const [EventRecord,setEventRecord]= useState(event)

  useEffect(()=>{
    setTicketListing(tickets)
    setEventRecord(event)

  },[tickets,event])

  const updateTicketCount = (ticketId: string, change: number) => {
    setSelectedTickets((prev) => {
      const existingTicket = prev.find((t) => t.ticket_id === ticketId);

      if (existingTicket) {
        const updatedCount = existingTicket.count + change;
        if (updatedCount > 0) {
          return prev.map((t) =>
            t.ticket_id === ticketId ? { ...t, count: updatedCount } : t
          );
        } else {
          // Remove the ticket from the array when count is 0
          return prev.filter((t) => t.ticket_id !== ticketId);
        }
      } else if (change > 0) {
        return [...prev, { ticket_id: ticketId, count: 1 }];
      }
      return prev;
    });
    handleTickets(selectedTickets)
  };

  return (
    <div className="mt-4">
     <h5 className={classes.event_name}>Get your tickets!</h5>
      <div className="row">
        {ticketListing?.map((item) => {
          const selectedTicket = selectedTickets.find((t) => t.ticket_id === item.ticket_id);
          const selectedCount = selectedTicket ? selectedTicket.count : 0;

          return (
            <div key={item.ticket_id} className="col-md-12">
               <div className={classNames(classes.card_start, "card", classes.spacing)}>
                <div  className={classNames(classes.card_body, classes.card_btn)}>
                  <p  className={classes.card_title}>
                    <span>{item.name}</span>
                  </p>
                  <p className={classes.desc_card}>
                    <span>{item.description}</span>
                  </p>
                  <div className={classes.cards_btn}>
                    {EventRecord?.free ? (
                      <p  className={classes.card_title}>
                        <span>Free</span>
                      </p>
                    ) : (
                      <p  className={classes.card_title}>
                        <span>
                          {EventRecord?.currency_symbol}
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
                          onClick={() => updateTicketCount(item.ticket_id, -1)}
                          style={{ cursor: selectedCount > 0 ? "pointer" : "not-allowed", opacity: selectedCount > 0 ? 1 : 0.5 }}
                        >
                          <i className="bi bi-dash-circle-fill"></i>
                        </span>
                        <span className={classes.quantity_display}>{selectedCount}</span>
                        <span
                          className="m-2 increment-btn"
                          onClick={() => updateTicketCount(item.ticket_id, 1)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="bi bi-plus-circle-fill"></i>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TicketList;