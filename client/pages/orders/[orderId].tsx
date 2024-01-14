import buildClient from "@/api/build-client";
import requestHook from "@/src/hooks/requestHook";
import router from "next/router";
import React, { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

export const OrderShow = (orderData: any) => {
  const { requestData, formErrors } = requestHook(
    `/api/payments`,
    "post",
    (res) => {
      console.log(res);
      router.push("/");
    }
  );
  const [timeLeft, setTimeLeft] = useState(0);
  useEffect(() => {
    const newTimeLeft = Math.round(
      (new Date(orderData.expiresAt).getTime() - new Date().getTime()) / 1000
    );
    setTimeLeft(newTimeLeft);
  }, []);

  useEffect(() => {
    if (timeLeft === 0) return;

    // setTimeLeft(newTimeLeft);
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, [timeLeft]);
  if (timeLeft === 0) return <div>Order expired</div>;
  return (
    <div>
      Time left to pay: {timeLeft} seconds
      {/* Tofix email */}
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
