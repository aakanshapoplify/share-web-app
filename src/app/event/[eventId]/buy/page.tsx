"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_EVENT,
  GET_EVENT_DETAILS,
  ACTIONS_UPDATES,
} from "../../../../graphql/event.graphql";

import Loading from "@/components/Loading";
import classNames from "classnames";
import classes from "./eventDetails.module.css";
import moment from "moment";
import TicketList from "@/components/TicketList";
import { toast } from "react-toastify";
import PromCode from "@/components/Promocode";
import { useRouter } from "next/navigation";

export default function EventDetail() {
  const router = useRouter();
  const { eventId } = useParams();
  const [fetchTickets] = useLazyQuery(ACTIONS_UPDATES);
  const [allTicketData, setAllTicketData] = useState<any>([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  const [showTickets, setShowTickets] = useState(false);
  const [selectedTicketData, setSelectedTicketData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promocode, setPromocode] = useState("");
  const [data, setData] = useState<any>();
  const [processed, setProceed] = useState(true);
  const [selectedTicketTerms, setSelectedTicketTerms] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState<string[]>([]);
  const [type,setType] = useState("");

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

  useEffect(() => {
    if (tickets) {
      setAllTicketData(tickets);
    }
  }, [tickets]);

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
  const handleData = async (data: any, type: string) => {
    setType(type)
    type === "ticket"
      ? setSelectedTicketData(data)
      : type === "promocode"
      ? setPromocode(data)
      : "";
  };

  useEffect(() => {
    if (selectedTicketData.length > 0) {
      handleOnSave();
    }
  }, [JSON.stringify(selectedTicketData), promocode]);

  const handleOnSave = async () => {
    setIsLoading(true);
    try {
      let selectedTicketInput = {
        event_id: event?.event_id,
        guest_user: true,
        guest_details: {
          name: formData?.name,
          email: formData?.email,
        },
        tickets: selectedTicketData,
        promo_code: promocode,
      };
      const response = await fetchTickets({
        variables: { selectedTicketInput },
      });
      setProceed(false);
      setData(response?.data?.selectTicketsStep2);
      let ticketRes = response?.data?.selectTicketsStep2?.tickets;
      type == "promocode" ? showMessage():""
      setAllTicketData(ticketRes);
      await getSelectedTerms(ticketRes);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setProceed(true);
      console.error("Failed to fetch data:", err);
    }
  };
  const showMessage = () =>{
    console.log(data?.promo_code?.value,"data?.promo_code?.value",data?.promo_code)
    if(data?.promo_code?.value == null ||data?.promo_code?.value == "" ){
     toast.error(data?.promo_code?.message)
     return
    }
    toast.success(data?.promo_code?.message)

  }

  const handleNextStep = () => {
    if (selectedTicketTerms.length !== acceptedTerms.length) {
      toast.error("Please accept all terms & conditions before proceeding.");
      return;
    }
    if (data?.addons) {
      router.push(`/event/${event?.event_id}/buy/addons`);
    }
    // Proceed to the next step...
  };

  const getSelectedTerms = (ticketRes: any) => {
    const matchedTerms = selectedTicketData
      .map(
        (selectedTicket: { ticket_id: any }) =>
          ticketRes.find(
            (ticket: any) => ticket.ticket_id === selectedTicket.ticket_id
          )?.terms || []
      )
      .flat();
    setSelectedTicketTerms(matchedTerms);
  };
  const handleAcceptTerm = (term: string) => {
    setAcceptedTerms((prev) =>
      prev.includes(term) ? prev.filter((t) => t !== term) : [...prev, term]
    );
  };

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
        {showTickets && (
          <>
            <TicketList
              tickets={allTicketData}
              event={event}
              handleTickets={handleData}
              isDisable={isLoading}
            />
            <PromCode
              isDisable={selectedTicketData.length === 0 || isLoading}
              promo_code={data?.promo_code}
              handlePromocode={handleData}
            />
            <div className="col-12 mt-2 mt-sm-0">
              {selectedTicketTerms.length > 0 && (
                <div className={classNames("mt-3", classes.ul_decorator)}>
                  <h5>Terms & Conditions:</h5>
                  {selectedTicketTerms.map((term, index) => (
                    <div key={index} className={classes.terms_div}>
                      <input
                        type="checkbox"
                        className={classes.checkbox}
                        checked={acceptedTerms.includes(term)}
                        onChange={() => handleAcceptTerm(term)}
                      />
                      {term}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleNextStep}
                className={classNames(
                  "btn btn-dark mt-3 ms-2",
                  classes.menu_btn
                )}
                disabled={processed}
                style={{
                  opacity: processed ? 0.5 : 1,
                }}
              >
                Proceed to next step
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
