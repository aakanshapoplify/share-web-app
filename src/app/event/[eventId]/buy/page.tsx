"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import {
  GET_EVENT,
  GET_EVENT_DETAILS,
  ACTIONS_UPDATES,
} from "../../../../graphql/event.graphql";
import { SETUP_PAYMENT, JOIN_EVENT } from "../../../../graphql/payment.graphql";

import Loading from "@/components/Loading";
import classNames from "classnames";
import classes from "./eventDetails.module.css";
import moment from "moment";
import TicketList from "@/components/TicketList";
import { toast } from "react-toastify";
import PromCode from "@/components/Promocode";
import { useRouter } from "next/navigation";
import Addons from "@/components/Addons/page";
import PaymentSucceed from "@/components/Succeed/page";
import StripeWrapper from "@/components/StripeWrapper";
import CheckoutForm from "@/components/CheckoutForm";

export default function EventDetail() {
  const router = useRouter();
  const { eventId } = useParams();
  const [fetchTickets] = useLazyQuery(ACTIONS_UPDATES);
  const [allTicketData, setAllTicketData] = useState<any>([]);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  const [showTickets, setShowTickets] = useState(false);
  const [showTicketsAddons, setShowTicketsAddons] = useState(false);
  const [selectedTicketData, setSelectedTicketData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promocode, setPromocode] = useState("");
  const [data, setData] = useState<any>();
  const [processed, setProceed] = useState(true);
  const [selectedTicketTerms, setSelectedTicketTerms] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState<string[]>([]);
  const [type, setType] = useState("");
  const [AddonsData, setAddonsData] = useState<any>([]);
  const [setupPayment] = useMutation(SETUP_PAYMENT);
  const [paymentSuccess] = useMutation(JOIN_EVENT);
  const [paymentCheckout, setPaymentCheckout] = useState<any>();
  const [Succeed, setSucceed] = useState(false);
  const [stripProceed, setStripProceed] = useState(false);


  const [payment, setPayment] = useState<any>();

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
    setType(type);
    type === "ticket"
      ? setSelectedTicketData(data)
      : type === "promocode"
      ? setPromocode(data)
      : type === "addons"
      ? setAddonsData(data)
      : "";
  };

  useEffect(() => {
    if (selectedTicketData.length > 0) {
      handleOnSave();
    }
  }, [JSON.stringify(selectedTicketData), promocode, AddonsData]);

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
        addons: AddonsData,
      };
      const response = await fetchTickets({
        variables: { selectedTicketInput },
      });
      if (response?.data?.selectTicketsStep2) {
        setProceed(false);
        setData(response?.data?.selectTicketsStep2);
        let ticketRes = response?.data?.selectTicketsStep2?.tickets;
        let paymentObject = {
          total: response?.data?.selectTicketsStep2.total,
          currency_symbol: response?.data?.selectTicketsStep2.currency_symbol,
          booking_fee: response?.data?.selectTicketsStep2.booking_fee,
        };
        setPayment(paymentObject);
        type == "promocode" ? showMessage() : "";
        setAllTicketData(ticketRes);
        await getSelectedTerms(ticketRes);
        setIsLoading(false);
      } else {
        setProceed(false);
        setIsLoading(false);
        // Handle GraphQL API errors
        const errorMessage =
          response?.errors?.[0]?.message || "Something went wrong!";
        console.error("GraphQL Error:", errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      setIsLoading(false);
      setProceed(false);
      console.error("Failed to fetch data:", err);
    }
  };
  const showMessage = () => {
    if (data?.promo_code?.value == null || data?.promo_code?.value == "") {
      toast.error(data?.promo_code?.message);
      return;
    }
    toast.success(data?.promo_code?.message);
  };
  const getSelectedTerms = (ticketRes: any) => {
    const matchedTerms = selectedTicketData
      ?.map(
        (selectedTicket: { ticket_id: any }) =>
          ticketRes?.find(
            (ticket: any) => ticket?.ticket_id === selectedTicket?.ticket_id
          )?.terms || []
      )
      .flat();
    setSelectedTicketTerms(matchedTerms);
  };
  const handleAcceptTerm = (term: string) => {
    setAcceptedTerms((prev) =>
      prev?.includes(term) ? prev?.filter((t) => t !== term) : [...prev, term]
    );
  };

  const handleToNextStep = (type: string) => {
    paymentSetup()
  };

  const handleNextStep = () => {
    if (selectedTicketTerms.length !== acceptedTerms.length) {
      toast.error("Please accept all terms & conditions before proceeding.");
      return;
    }
    if (data?.addons?.length > 0) {
      setShowTickets(false);
      setShowTicketsAddons(true);
    } else {
      paymentSetup();
    }
    // Proceed to the next step...
  };

  const paymentSetup = async () => {
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
        addons: AddonsData,
      };

      const response = await setupPayment({
        variables: { selectedTicketInput },
      });

      setPaymentCheckout(response?.data?.setupEventPayment);
      if (response?.data?.setupEventPayment?.payment_intent_id && data?.total > 0) {
        setStripProceed(true);
      } else {
        paymentProcess("")
        // If payment isn't required
        console.log("No payment required, proceed without Stripe.");
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setStripProceed(false);
    } finally {
      setIsLoading(false);
    }
  };
  

  const paymentProcess = async (paymentIntentId: any) => {
    setIsLoading(true);
    try {
      let selectedTicketInput = {
        event_id: event?.event_id,
        guest_user: true,
        guest_details: {
          name: formData?.name,
          email: formData?.email,
        },
        stripe_payment_intent_id: paymentIntentId || "",
        tickets: selectedTicketData,
        promo_code: promocode,
        addons: AddonsData,
      };
      const response = await paymentSuccess({
        variables: { selectedTicketInput },
      });
      console.log(response,"response")
      redirectToSuccessPage();

      // if(response?.data?.payment_intent_id && data?.total > 0 ){

      // }else{

      // }
    } catch (err) {
      setIsLoading(false);
      setProceed(false);
      console.error("Failed to fetch data:", err);
    }
  };
  const paymentSubmit=(paymentIntentId:string)=>{
    paymentProcess(paymentIntentId)
  }

  const redirectToSuccessPage = () => {
    setSucceed(true);
    setShowTicketsAddons(false);
    setShowTickets(false);
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
                  <small className={classes.card_title}> {selectedTicketData?.length>0 ?data?.total:event.price}</small>
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
        {!showTickets && !showTicketsAddons && !Succeed && !stripProceed && (
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
        {showTickets && !showTicketsAddons && !Succeed && !stripProceed && (
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
                  {selectedTicketTerms?.map((term, index) => (
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
              {data?.total > 0 && (
                <div
                  className={classNames("mb-1", classes.amount)}
                  id="amount-div"
                >
                  <small>
                    Booking fees: {data?.currency_symbol}{" "}
                    {parseFloat(data?.booking_fee)?.toFixed(2)}
                  </small>
                  <p className="card-title">
                    {" "}
                    <span id="total-amount">
                      {data?.currency_symbol}{" "}
                      {parseFloat(data?.total)?.toFixed(2)}
                    </span>
                  </p>
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
        {showTicketsAddons && !showTickets && !stripProceed &&  (
          <>
            <Addons
              addonsData={data.addons}
              processToNext={handleToNextStep}
              handleAddons={handleData}
              paymentObject={payment}
            />
          </>
        )}
        {!showTicketsAddons && !showTickets && Succeed && !stripProceed && (
          <>
            <PaymentSucceed />
          </>
        )}
         {stripProceed && paymentCheckout?.payment_intent_id && (
        <StripeWrapper>
          <CheckoutForm 
            paymentIntentId={paymentCheckout.client_secret}
            onSuccess={(paymentIntentId: string) => paymentSubmit(paymentIntentId)}
          />
        </StripeWrapper>
      )}
      </div>
    </div>
  );
}
