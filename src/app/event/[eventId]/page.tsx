"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_EVENT } from "../../../graphql/event.graphql";

export default function EventPage() {
  const { eventId } = useParams();

  const { data, loading } = useQuery(GET_EVENT, {
    variables: { event_id: eventId },
  });

  console.log(data, "data");
  return (
    <div>
      <h1>Event Details</h1>
      <p>Event ID: {eventId}</p>
      {/* Fetch event details here */}
    </div>
  );
}
