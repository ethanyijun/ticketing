import buildClient from "@/api/build-client";
import requestHook from "@/src/hooks/requestHook";
import router from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../src/store/features/cartSlice";

const TicketShow = (ticketData: any) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: ticketData.id,
        title: ticketData.title,
        price: ticketData.price,
        quantity: Number(quantity),
      })
    );
  };

  const { requestData, formErrors } = requestHook(
    `/api/orders`,
    "post",
    (response) => {
      router.push("/orders/[orderId]", `/orders/${response?.data.id}`);
    }
  );
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Title: {ticketData.title}</h1>
      <p className="text-xl text-gray-700 mb-6">Price: ${ticketData.price}</p>

      <div className="mb-4">
        <label htmlFor="quantity" className="block mb-2 font-semibold">
          Quantity:
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border rounded px-2 py-1 w-24"
        >
          {Array.from(
            { length: ticketData.availableTickets || 1 },
            (_, i) => i + 1
          ).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {formErrors && <div className="text-red-500 mb-4">{formErrors}</div>}
      <button
        onClick={handleAddToCart}
        className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-sky-500 focus:outline-none focus:shadow-outline transition duration-150"
      >
        Add to Cart
      </button>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const client = buildClient(context);

  try {
    const { data } = await client.get(`/api/tickets/${context.query.ticketId}`);
    return { props: { ...data } };
  } catch (err: any) {
    // If API returns 401 or similar
    if (err.response?.status === 401) {
      // Option 1: redirect to signin
      return {
        redirect: {
          destination: "/auth/signin",
          permanent: false,
        },
      };

      // Option 2: or show an error message (instead of redirect)
      // return { props: { error: "unauthorized" } };
    }

    // Handle other errors
    return { props: { error: "unknown" } };
  }
}
export default TicketShow;
