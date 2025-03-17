"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_CLUBS,GET_CLUBS_DETAILS } from "../../../graphql/club.graphql";
import Loading from "@/components/Loading";
import classNames from "classnames";
import classes from "./club.module.css";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

const SHARE_DOMAIN = process.env.NEXT_PUBLIC_SHARE_DOMAIN ?? "";

export default function ClubPage() {
  const { clubId } = useParams();
  const [qrcode, setQrcode] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const { data, loading } = useQuery(GET_CLUBS, {
    variables: { club_id: clubId },
    skip: !clubId,
  });
  const { data: clubData, loading: clubLoading } = useQuery(
    GET_CLUBS_DETAILS,
    {
      variables: { club_id: clubId },
    }
  );

  useEffect(() => {
    if (clubId) {
      QRCode.toDataURL(`${SHARE_DOMAIN}/event/${clubId}/buy`)
        .then(setQrcode)
        .catch(console.error);
    }
  }, [clubId]);



  const organizerDetails = clubData?.clubHomePageDetails?.organiser;
  const club = data?.clubBasicDetails;
  const isDescriptionLong = club?.description?.length > 200;


  useEffect(() => {
    if (club?.name) {
      document.title = `Club - ${club.name}`; 
    }
  }, [club]);
  
  if (loading || clubLoading) return <Loading />;

  return (
    <div className="container text-center mb-4">
      <div className="row">
        <div className="col-md-12">
          <img
            alt={club.name}
            className={classNames("object-fit-cover", classes.image)}
            src={club.image}
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
                  alt={organizerDetails?.name}
                  className={classes.profilePic}
                  src={organizerDetails?.profile_picture}
                />
              </div>
              <div className={classNames(classes.card_description, "ms-3")}>
                <h5 className={classes.event_name}>{club.name}</h5>
                <p className={classes.card_text}>
                  <span
                    id="eventDescription"
                    dangerouslySetInnerHTML={{
                      __html:
                        expanded || !isDescriptionLong
                          ? club.description.replace(/\n/g, "<br />")
                          : `${club.description
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
          <div className="col-12 mt-2 mt-sm-0">
            <a
              className={classNames("btn btn-dark", classes.menu_btn)}
              href={`cliq://clubs/${clubId}`}
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
                  alt="Club QR Code"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
