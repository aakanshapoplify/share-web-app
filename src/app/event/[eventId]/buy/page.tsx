"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_EVENT } from "../../../../graphql/event.graphql";
import Loading from "@/components/Loading";
import classNames from "classnames";
import classes from "./eventDetails.module.css";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

const SHARE_DOMAIN = process.env.NEXT_PUBLIC_SHARE_DOMAIN ?? "";

export default function EventPage() {
  const { eventId } = useParams();
  const { data, loading } = useQuery(GET_EVENT, {
    variables: { event_id: eventId },
  });

  const [qrcode, setQrcode] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (eventId) {
      QRCode.toDataURL(`${SHARE_DOMAIN}/event/${eventId}/buy`)
        .then(setQrcode)
        .catch(console.error); // Catch any errors
    }
  }, [eventId]);

  // Check if event data is available
  const event = data?.eventDetail;
  if (!event || loading) return <Loading />;

  // Function to check if description is longer than two lines
  const isDescriptionLong = event.description?.length > 200; // Adjust limit as needed

  return (
    <div className="container text-center mb-4">
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
              className={classNames(
                classes.card_body,
                classes.event_detail,
                "card-body"
              )}
            >
              <div>
                <img
                  alt={event.organiser.name}
                  className={classes.profilePic}
                  src={event.organiser.profile_picture}
                />
              </div>
              <div className={classNames(classes.card_description, "ms-3")}>
                <h5 className={classes.event_name}>{event.name}</h5>
                <p className={classes.card_text}>
                  <span
                    id="eventDescription"
                    dangerouslySetInnerHTML={{
                      __html:
                        expanded || !isDescriptionLong
                          ? event.description.replace(/\n/g, "<br />")
                          : `${event.description
                              .slice(0, 200)
                              .replace(/\n/g, "<br />")}...`,
                    }}
                  />
                </p>
                {isDescriptionLong && (
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className={classNames(
                      classes.seeMoreLess,
                      classes.btn_link,
                      "btn"
                    )}
                  >
                    {expanded ? "See Less" : "See More"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="justify-content-sm-center mt-2">
          <div className="col-12 mt-sm-0 mb-1">
            {event?.waitlist_count > 0 ? (
              <a
                className={classNames(
                  "btn btn-dark download-link",
                  classes.menu_btn
                )}
                id="buyTicket"
                href="#"
              >
                Download the app to join the waitlist
              </a>
            ) : (
              <a
                className={classNames("btn btn-dark", classes.menu_btn)}
                id="buyTicket"
                href={`${eventId}/buy`}
              >
                Buy tickets online!
              </a>
            )}
          </div>
          <div className="col-12 mt-2 mt-sm-0">
            <a
              className={classNames("btn btn-dark", classes.menu_btn)}
              href={`cliq://events/${eventId}`}
            >
              Open in app
            </a>
          </div>
        </div>

        {qrcode && (
          <div className={classNames("col-md-12 ", classes.eventBody)}>
            <div className={classNames("card ", classes.card_start)}>
              <div className="mt-3">
                <h5 className={classNames("m-0", classes.event_name)}>
                  Scan to join
                </h5>
                <img
                  className={classes.qr_code}
                  src={qrcode}
                  alt="Event QR Code"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

