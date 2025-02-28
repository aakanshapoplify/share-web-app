"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import logo from "../assets/logo.png";
import classes from "./styles/eventCard.module.css";
import { useSearchParams } from "next/navigation";
import classNames from "classnames";

export default function Header() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event_id") || "";
  const [mobileOS, setMobileOS] = useState<string>("unknown");

  useEffect(() => {
    function getMobileOperatingSystem() {
      if (typeof window === "undefined") return "unknown"; // Prevent SSR errors
      const userAgent = navigator.userAgent || navigator.vendor;
      if (/android/i.test(userAgent)) return "Android";
      if (/iPad|iPhone|iPod/.test(userAgent)) return "iOS";
      return "unknown";
    }
    setMobileOS(getMobileOperatingSystem());
  }, []);

  function redirectToAppOrStore(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (typeof window === "undefined") return;

    const appURL = event.currentTarget.href;
    window.location.assign(appURL);
    const now = Date.now();

    setTimeout(() => {
      if (Date.now() - now < 5000) {
        window.location.href =
          mobileOS === "Android"
            ? "https://play.google.com/store/apps/details?id=com.thecliq.app"
            : mobileOS === "iOS"
            ? "https://apps.apple.com/gb/app/cliq-connect-meet-people/id6451363528"
            : "https://thecliq.app/";
      }
    }, 3000);
  }

  function downloadApp(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (typeof window === "undefined") return;

    window.location.href =
      mobileOS === "Android"
        ? "https://play.google.com/store/apps/details?id=com.thecliq.app"
        : mobileOS === "iOS"
        ? "https://apps.apple.com/gb/app/cliq-connect-meet-people/id6451363528"
        : "https://thecliq.app/";
  }

  return (
    <header className="bg-blue-600 text-white py-4 px-6 fixed top-0 w-full shadow-md">
      <div className={classes.headerLogo}>
        <div>
          <Image
            alt="CLIQ - Connect and Meet People"
            className={classes.logo}
            src={logo}
            width={100}
            height={50}
          />
        </div>
        <div className={classes.btn_container}>
          <a
            className={classNames(classes.logo_btn, classes.logo_a, "me-2")}
            href="#"
            onClick={downloadApp}
          >
            Download to join
          </a>
          <a
            className={classNames(classes.logo_btn, classes.logo_a)}
            href={`cliq://events/${eventId}`}
            onClick={redirectToAppOrStore}
          >
            Open in app
          </a>
        </div>
      </div>
    </header>
  );
}
