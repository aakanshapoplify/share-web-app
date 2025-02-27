"use client"; // Required for interactive components

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white py-4 px-6 fixed top-0 w-full shadow-md">
      <nav className="flex justify-between items-center">
        <h1 className="text-xl font-bold">My Event App</h1>
        <ul className="flex gap-4">
          <li>
            <Link href="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/events" className="hover:underline">
              Events
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
