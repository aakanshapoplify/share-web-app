"use client";
import classNames from "classnames";
import React from "react";
import classes from "./succeed.module.css";

const PaymentSucceed = () => {
  return (
    <div className="col-md-12 mt-4">
      <div className={classNames("card", "p-3", classes.card_start)}>
        <div className="m-3">
          <h5 className={classes.event_name}>Ticket Secured!</h5>
          <small>
            Download the app to access your ticket, join the community, access
            the event chats and so much more.
          </small>
        </div>
      </div>
      <div className={classNames(classes.eventBody, "col-md-12")}>
        <div className={classNames(classes.card_footer)}>
          <div className="p-3">
            <h4 className="text-center mt-3">Download Now</h4>
            <div
              className={classNames(
                classes.footer_imgs,
                "d-flex justify-content-center"
              )}
            >
              <div className="">
                <a
                  href="https://play.google.com/store/apps/details?id=com.thecliq.app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://cdn.prod.website-files.com/660f9fdac217f20cb081a218/661514fa62507bb653df0e69_Group%201171276558.png"
                    loading="lazy"
                    alt="Google Play"
                    className="image-4 image-36"
                  />
                </a>
              </div>
              <div>
                <a
                  href="https://apps.apple.com/gb/app/cliq-connect-meet-people/id6451363528"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://cdn.prod.website-files.com/660f9fdac217f20cb081a218/66151535abf52fb29bcf0aad_Group%201171276559.png"
                    loading="lazy"
                    alt="App Store"
                    className="image-5 image-36"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSucceed;
