import buildClient from "@/api/build-client";
import requestHook from "@/src/hooks/requestHook";
import router from "next/router";
import React from "react";

const TicketShow = (ticketData: any) => {
  const { requestData, formErrors } = requestHook(
    `/api/orders`,
    "post",
    (response) => {
      console.log("response: ", response);
      router.push("/orders/[orderId]", `/orders/${response?.data.id}`);
    }
  );
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Title: {ticketData.title}</h1>
      <p className="text-xl text-gray-700 mb-6">Price: ${ticketData.price}</p>

      {formErrors && <div className="text-red-500 mb-4">{formErrors}</div>}

      <button
        onClick={async () => await requestData({ ticketId: ticketData.id })}
        className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-sky-500 focus:outline-none focus:shadow-outline transition duration-150"
      >
        Purchase
      </button>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const client = buildClient(context);
  const { data } = await client.get(`/api/tickets/${context.query.ticketId}`);
  const response = await client.get("/api/users/currentuser");
  return {
    props: { ...response.data, ...data }, // will be passed to the page component as props
  };
}

export default TicketShow;
