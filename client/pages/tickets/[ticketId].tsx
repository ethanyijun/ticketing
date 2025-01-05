import buildClient from "@/api/build-client";
import requestHook from "@/src/hooks/requestHook";
import router from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../src/store/features/cartSlice";

const TicketShow = (ticketData: any) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: ticketData.id,
        title: ticketData.title,
        price: ticketData.price,
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
  const { data } = await client.get(`/api/tickets/${context.query.ticketId}`);
  const response = await client.get("/api/users/currentuser");
  return {
    props: { ...response.data, ...data }, // will be passed to the page component as props
  };
}

export default TicketShow;
