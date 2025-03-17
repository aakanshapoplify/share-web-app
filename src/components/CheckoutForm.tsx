import React, { useState } from "react";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import classes from "./styles/eventCard.module.css";
import classNames from "classnames";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

interface StripeModalProps {
  isOpen: boolean; // Changed from function to boolean
  onRequestClose: () => void;
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
}

const CheckoutForm = ({
  isOpen,
  onRequestClose,
  clientSecret,
  onSuccess,
}: StripeModalProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      Swal.fire("Payment Failed", error.message || "Unknown error", "error");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      Swal.fire(
        "Payment Successful",
        "Your payment was processed successfully",
        "success"
      );
      onSuccess(paymentIntent.id);
      onRequestClose(); // Close the modal after success
    }

    setIsProcessing(false);
  };

  return (
    <Modal
      isOpen={isOpen} // Use boolean value here
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      className={classes.modal_content}
      overlayClassName={classes.modal_overlay}
    >
      <div
        className={classNames(classes.cancelBtn, "close")}
        onClick={onRequestClose}
      >
        <span aria-hidden="true">&times;</span>
      </div>
      <form
        onSubmit={handleSubmit}
        className={classNames("p-6 bg-white rounded-lg shadow-lg w-96",classes.form_layout)}
      >
        <h2 className={classes.event_name}>Enter Card Details</h2>
        <div className={classNames("mb-4",classes.card_element)}>
          <CardElement
            options={{
              style: {
                base: { fontSize: "16px", color: "#424770" },
                invalid: { color: "#9e2146" },
              },
            }}
          />
           </div>
       
        <div className={classes.btn_div}>
        <button
                className={classNames(
                  "btn btn-dark mt-5 ms-2",
                  classes.menu_btn
                )}
                disabled={isProcessing}
                style={{
                  opacity: isProcessing ? 0.5 : 1,
                }}
                type="submit"

              >
                {isProcessing ? "Processing..." : "Submit"}
              </button>
        </div>
       
      </form>
    </Modal>
  );
};

export default CheckoutForm;
