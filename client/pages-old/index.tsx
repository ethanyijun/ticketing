import buildClient from "@/api/build-client";
import React from "react";
import Link from "next/link";
import requestHook from "@/src/hooks/requestHook";
import router from "next/router";

export const Index = ({ tickets, currentUser }: any) => {
  const { requestData, formErrors } = requestHook(
    `/api/tickets/:id`,
    "delete",
    () => {
      router.push("/");
    }
  );

  const handleDelete = async (ticketId: string) => {
    await requestData({}, { id: ticketId }); // Pass the ID as path param
  };
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
              {currentUser && currentUser.role === "admin" && (
                <th className="py-2 px-4 border-b text-left">Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {tickets &&
              tickets
                .filter((ticket: any) => ticket.availableTickets > 0)
                .map((ticket: any, index: number) => (
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
                    {currentUser && currentUser.role === "admin" && (
                      <td className="py-2 px-4 border-b text-left">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                          onClick={async () => handleDelete(ticket.id)}
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
  ) : (
    <h1 className="mt-12">You are not signed in</h1>
  );
};

export async function getServerSideProps(context: any) {
  const clientInstance = buildClient(context);

  try {
    const [currentUserResponse, ticketsResponse] = await Promise.all([
      clientInstance.get("api/users/currentuser"),
      clientInstance.get("api/tickets"),
    ]);

    return {
      props: {
        tickets: ticketsResponse.data,
        ...currentUserResponse.data,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        tickets: [],
        currentUser: null,
        error: "Failed to fetch data",
      },
    };
  }
}

export default Index;
