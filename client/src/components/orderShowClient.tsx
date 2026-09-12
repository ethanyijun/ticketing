"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StripeCheckout from "react-stripe-checkout";
import { useCountdown } from "@/src/hooks/countDownHook";
import requestHook from "@/src/hooks/requestHook";

export default function OrderShowClient({
  orderData,
  currentUser,
}: {
  orderData: any;
  currentUser?: any;
}) {
  const router = useRouter();
  const { requestData, formErrors } = requestHook(
    `/api/payments`,
    "post",
    (res) => router.push("/")
  );

  // ✅ Always call hook at the top level
  const timeLeft = useCountdown(orderData.expiresAt, orderData.status);

  // 🧠 Use client-only flag just for rendering control, not for hook condition
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="text-center mt-12">Loading...</div>;
  }

  if (orderData.status === "complete") {
    return <div className="text-center mt-12">Order has completed</div>;
  }

  if (timeLeft <= 0) {
    return <div className="text-center mt-12">Order expired</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg text-center">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <p className="text-xl text-gray-700 mb-6">
        Time left to pay: {timeLeft} seconds
      </p>

      <StripeCheckout
        token={async ({ id }) =>
          await requestData({ token: id, orderId: orderData.id })
        }
        stripeKey="pk_test_51ONsF1LWfQj4tsQ46dTPmotgD0oEx9KDPZHvm09rHS3Eth6NiBGLhqDDqNKkQt1IQE9LF72oEbXhEpyv3q3S4kQf00J4xnUGp7"
        amount={orderData.ticket.price * 100}
        email={currentUser?.email ?? "guest@example.com"}
      />

      {formErrors && <div className="text-red-500 mt-4">{formErrors}</div>}
    </div>
  );
}
