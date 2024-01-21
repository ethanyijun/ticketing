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
    <div>
      Time left to pay: {timeLeft} seconds
      {/* TODO add email service */}
      <StripeCheckout
        token={async ({ id }) =>
          await requestData({ token: id, orderId: orderData.id })
        }
        stripeKey="pk_test_51ONsF1LWfQj4tsQ46dTPmotgD0oEx9KDPZHvm09rHS3Eth6NiBGLhqDDqNKkQt1IQE9LF72oEbXhEpyv3q3S4kQf00J4xnUGp7"
        amount={orderData.ticket.price * 100}
        email="t@t.com"
      />
      {formErrors}
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const client = buildClient(context);
  const { data } = await client.get(`/api/orders/${context.query.orderId}`);
  return {
    props: data, // will be passed to the page component as props
  };
}

export default OrderShow;
