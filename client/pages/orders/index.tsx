import buildClient from "@/api/build-client";
import Link from "next/link";
import React from "react";

const OrderList = ({ orders }: any) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Order List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b text-left font-medium text-gray-700">
                Ticket
              </th>
              <th className="py-3 px-4 border-b text-left font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((order: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b text-gray-900">
                    {order.ticket.title}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-900">
                    {order.status}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const clientInstance = buildClient(context);
  const currentUser = await clientInstance.get("/api/users/currentuser");
  const response = await clientInstance.get("/api/orders");
  return { props: { orders: response.data, currentUser: currentUser.data } };
}

export default OrderList;
