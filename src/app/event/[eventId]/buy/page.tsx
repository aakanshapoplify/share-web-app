"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  GET_EVENT,
  GET_EVENT_DETAILS,
} from "../../../../graphql/event.graphql";
import Loading from "@/components/Loading";
import classNames from "classnames";
import classes from "./eventDetails.module.css";
import moment from "moment";
import TicketList from "@/components/TicketList";

export default function EventDetail() {
  const { eventId } = useParams();
  const { data: eventData, loading: eventLoading } = useQuery(GET_EVENT, {
    variables: { event_id: eventId },
  });

  const { data: ticketData, loading: ticketLoading } = useQuery(
    GET_EVENT_DETAILS,
    {
      variables: { event_id: eventId },
    }
  );

  const event = eventData?.eventDetail;
  const tickets = ticketData?.eventTicketsStep1;

  // Store form data in state
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  const [showTickets, setShowTickets] = useState(false);



  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "name" && /\d/.test(value)) return;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: validateField(name, value),
    }));
  };

  const validateField = (name: string, value: string): string => {
    if (!value.trim())
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    if (name === "email" && !emailRegex.test(value))
      return "Invalid email format";
    return "";
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach((key) => {
      const errorMessage = validateField(
        key,
        formData[key as keyof typeof formData]
      );
      if (errorMessage) newErrors[key] = errorMessage;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setShowTickets(true);
  };
  const handleTickets=(data:any)=>{
    console.log(data,"====")
  }
  if (eventLoading || ticketLoading) return <Loading />;

  return (
    <div className="container mb-4">
      <div className="row">
        <div className="col-md-12">
          <img
            alt={event.name}
            className={classNames("object-fit-cover", classes.image)}
            src={event.image}
          />
        </div>
        <div className={classNames("col-md-12", classes.eventBody)}>
          <div className={classNames("card", classes.card_start)}>
            <div
              className={classNames(classes.card_body, classes.ticket_detail)}
            >
              <div>
                <i className="bi bi-ticket-fill"></i>
                <small className={classes.icon}>
                  Ticket price:
                  <small className={classes.card_title}>{event.price}</small>
                </small>
              </div>

              <small>
                <i className="bi bi-clock"></i>
                <small className={classes.icon}>
                  {moment(event.start_time).format("DD/MM/YYYY")}
                </small>
              </small>
            </div>
            <small className={classes.address}>
              <i className="bi bi-geo-alt-fill"></i>
              <a className={classNames(classes.icon, classes.address_link)}>
                {event.location.address}
              </a>
            </small>
          </div>
        </div>
        {!showTickets && (
          <div className={classNames(classes.user_details, "mt-4")}>
            <h5 className={classes.event_name}>Enter your details:</h5>
            <form>
              <div className={classNames(classes.card_start, "card", "p-3")}>
                <div className="form-group mb-3">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your name"
                    autoComplete="off"
                    value={formData.name}
                    onChange={(e) => handleChange(e)}
                  />
                  {errors.name && (
                    <div className="text-danger">{errors.name}</div>
                  )}
                </div>

                <div className="form-group mb-3">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your email"
                    autoComplete="off"
                    value={formData.email}
                    onChange={(e) => handleChange(e)}
                  />
                  {errors.email && (
                    <div className="text-danger">{errors.email}</div>
                  )}
                </div>
                <div className="col-12 mt-2 mt-sm-0">
                  <button
                    type="submit"
                    className={classNames("btn btn-dark", classes.menu_btn)}
                    onClick={(e) => handleSubmit(e)}
                  >
                    Get Tickets
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
        {/* {showTickets && ( */}
        <TicketList tickets={tickets} event={event} handleTickets={handleTickets}/>
        {/* )} */}
      </div>
    </div>
  );
}
