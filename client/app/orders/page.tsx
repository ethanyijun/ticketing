import buildClient from "@/api/build-client";
import Link from "next/link";

export default async function OrderList() {
  const client = await buildClient();

  try {
    // Fetch both concurrently
    const [ordersRes] = await Promise.all([client.get("/api/orders")]);

    const orders = ordersRes.data ?? [];

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
                      <Link
                        className="text-blue-600 hover:underline"
                        href={`/orders/${order.id}`}
                      >
                        {order.ticket.title}
                      </Link>
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
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div className="max-w-2xl mx-auto p-6 text-red-500">
        <h1 className="text-2xl font-bold mb-2">Failed to load</h1>
        <p>Please refresh or try again later.</p>
      </div>
    );
  }
}
