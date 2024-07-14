import buildClient from "@/api/build-client";
import axios, { AxiosInstance } from "axios";
import React from "react";
import Link from "next/link";

export const Index = ({ tickets, currentUser }: any) => {
  return currentUser ? (
    <>
      <h1 className="text-2xl font-bold mb-4">You are signed in</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Title</th>
              <th className="py-2 px-4 border-b text-left">Price</th>
              <th className="py-2 px-4 border-b text-left">Availability</th>
            </tr>
          </thead>
          <tbody>
            {tickets &&
              tickets.map((ticket: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    <Link
                      className="text-blue-600 hover:underline"
                      href="/tickets/[ticketId]"
                      as={`tickets/${ticket.id}`}
                    >
                      {ticket.title}
                    </Link>
                  </td>
                  <td className="py-2 px-4 border-b">${ticket.price}</td>
                  <td className="py-2 px-4 border-b">
                    {ticket.availableTickets}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <h1 className="mt-12">You are not signed in</h1>
  );
};

export async function getServerSideProps(context: any) {
  const clientInstance = buildClient(context);

  const response = await clientInstance.get("api/users/currentuser");

  const { data } = await clientInstance.get("api/tickets");

  return { props: { tickets: data, ...response.data } };
}

export default Index;
