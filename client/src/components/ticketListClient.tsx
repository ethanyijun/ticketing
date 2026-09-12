// components/TicketListClient.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import requestHook from "@/src/hooks/requestHook";

interface Ticket {
  id: string;
  title: string;
  price: number;
  availableTickets: number;
}

interface Props {
  tickets: Ticket[];
  currentUser: any;
}

export default function TicketListClient({ tickets, currentUser }: Props) {
  const router = useRouter();

  const { requestData, formErrors } = requestHook(
    `/api/tickets/:id`,
    "delete",
    () => {
      // Instead of router.push('/'), just revalidate current page
      router.refresh();
    }
  );
  const handleDelete = async (ticketId: string) => {
    await requestData({}, { id: ticketId });
  };

  if (!currentUser) {
    return <h1 className="mt-12 text-center">You are not signed in</h1>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">You are signed in</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Title</th>
              <th className="py-2 px-4 border-b text-left">Price</th>
              <th className="py-2 px-4 border-b text-left">Availability</th>
              {currentUser?.role === "admin" && (
                <th className="py-2 px-4 border-b text-left">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {tickets
              ?.filter((ticket) => ticket.availableTickets > 0)
              .map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <Link
                      className="text-blue-600 hover:underline"
                      href={`/tickets/${ticket.id}`}
                    >
                      {ticket.title}
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b">${ticket.price}</td>
                  <td className="py-2 px-4 border-b">
                    {ticket.availableTickets}
                  </td>
                  {currentUser?.role === "admin" && (
                    <td className="py-2 px-4 border-b text-left">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                        onClick={() => handleDelete(ticket.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {formErrors && <div className="mt-4 text-red-500">{formErrors}</div>}
    </>
  );
}
