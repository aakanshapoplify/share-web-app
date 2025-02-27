'use client'

import { useParams } from "next/navigation";
import Link from "next/link";

export default function EventPage() {
  const { eventId } = useParams();

  return (
    <div>
      <h1>Event Details</h1>
      <p>Event ID: {eventId}</p>
      <Link href={`/event/${eventId}/buy`}>
        <button>Buy Tickets</button>
      </Link>
    </div>
  );
}
