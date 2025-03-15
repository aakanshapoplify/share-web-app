// src/components/CheckoutForm.tsx
import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@mui/material";
import Swal from "sweetalert2";

interface CheckoutFormProps {
  paymentIntentId: string;
  onSuccess: (paymentIntentId: string) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ paymentIntentId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentId, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      Swal.fire("Payment Failed", error.message || "Unknown error", "error");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      Swal.fire("Payment Successful", "Your payment was processed successfully", "success");
      onSuccess(paymentIntent.id);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Button type="submit" disabled={!stripe || isProcessing} variant="contained" sx={{ mt: 2 }}>
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  );
};

export default CheckoutForm;
