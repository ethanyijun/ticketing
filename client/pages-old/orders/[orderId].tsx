// app/orders/[orderId]/page.tsx
import buildClient from "@/api/build-client";
import OrderShowClient from "@/src/components/orderShowClient";

export default async function OrderDetailPage({
  params,
}: {
  params: { orderId: string };
}) {
  const client = await buildClient();

  // Fetch data on the server
  const [orderResponse, currentUserResponse] = await Promise.all([
    client.get(`/api/orders/${params.orderId}`),
    client.get("/api/users/currentuser"),
  ]);

  const orderData = orderResponse.data;
  const currentUser = currentUserResponse.data?.currentUser ?? null;

  return <OrderShowClient orderData={orderData} currentUser={currentUser} />;
}
