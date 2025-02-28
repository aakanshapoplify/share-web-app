"use client";

import { CircularProgress } from "@mui/material";
import classes from "./styles/eventCard.module.css";

export default function Loading() {
  return (
    <div className={classes.wrapper}>
      <CircularProgress size={100} />
    </div>
  );
}