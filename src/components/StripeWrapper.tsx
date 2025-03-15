"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "");

interface StripeWrapperProps {
  children: React.ReactNode;
}

const StripeWrapper: React.FC<StripeWrapperProps> = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeWrapper;
