import buildClient from "@/api/build-client";
import { useCountdown } from "@/src/hooks/countDownHook";
import requestHook from "@/src/hooks/requestHook";
import router from "next/router";
import React, { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

export const OrderShow = (orderData: any) => {
  const { requestData, formErrors } = requestHook(
    `/api/payments`,
    "post",
    (res) => {
      router.push("/");
    }
  );
  const timeLeft = useCountdown(orderData.expiresAt, orderData.status);

  if (orderData.status === "complete") return <div>Order has completed</div>;
  if (timeLeft <= 0) return <div>Order expired</div>;
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg text-center">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <p className="text-xl text-gray-700 mb-6">
        Time left to pay: {timeLeft} seconds
      </p>
      {/* TODO add email service */}

      <StripeCheckout
        token={async ({ id }) =>
          await requestData({ token: id, orderId: orderData.id })
        }
        stripeKey="pk_test_51ONsF1LWfQj4tsQ46dTPmotgD0oEx9KDPZHvm09rHS3Eth6NiBGLhqDDqNKkQt1IQE9LF72oEbXhEpyv3q3S4kQf00J4xnUGp7"
        amount={orderData.ticket.price * 100}
        email="t@t.com"
        className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-sky-500 focus:outline-none focus:shadow-outline transition duration-150 mb-6"
      />

      {formErrors && <div className="text-red-500 mt-4">{formErrors}</div>}
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const client = buildClient(context);
  const currentUser = await client.get("/api/users/currentuser");

  const { data } = await client.get(`/api/orders/${context.query.orderId}`);
  return {
    props: { ...data, ...currentUser.data }, // will be passed to the page component as props
  };
}

export default OrderShow;
