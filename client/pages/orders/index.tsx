import buildClient from "@/api/build-client";
import Link from "next/link";
import React from "react";

const OrderList = (props: any) => {
  console.log("props: ", props);
  return (
    <div>
      <h1>OrderList</h1>
      <table>
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {props &&
            props.orders.map((order: any, index: number) => (
              <tr key={index}>
                <td>{order.ticket.title}</td>
                <td>{order.status}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const clientInstance = buildClient(context);
  const response = await clientInstance.get("/api/orders");
  return { props: { orders: response.data } };
}

export default OrderList;
