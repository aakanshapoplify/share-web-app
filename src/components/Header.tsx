"use client";

import Image from "next/image";
import logo from "../assets/logo.png";
import classes from "./styles/eventCard.module.css";
import { usePathname } from "next/navigation";
import classNames from "classnames";
import { redirectToAppOrStore, downloadApp } from "@/utils/redirectHandler";

export default function Header() {
  const pathname = usePathname(); 
  const completeUrl = `${pathname}`;

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
            href={`cliq:/${completeUrl}`}
            onClick={redirectToAppOrStore}
          >
            Open in app
          </a>
        </div>
      </div>
    </header>
  );
}
