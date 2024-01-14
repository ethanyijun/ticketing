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
    <div>
      <h1>Title: {ticketData.title}</h1>
      <p>Price: {ticketData.price}</p>
      {formErrors}
      <button
        onClick={async () => await requestData({ ticketId: ticketData.id })}
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
