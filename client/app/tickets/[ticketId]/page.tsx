import buildClient from "@/api/build-client";
import { redirect } from "next/navigation";
import TicketClient from "./TicketClient";

interface TicketData {
  id: string;
  title: string;
  price: number;
  availableTickets?: number;
}

// ✅ Server Component
export default async function TicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const client = await buildClient();
  const { ticketId } = await params;

  try {
    const { data }: { data: TicketData } = await client.get(
      `/api/tickets/${ticketId}`
    );

    // ✅ Render the client component and pass fetched data
    return <TicketClient ticketData={data} />;
  } catch (err: any) {
    if (err.response?.status === 401) {
      // Redirect to sign-in
      redirect("/auth/signin");
    }
    console.error(err);
    // Fallback UI for other errors
    return (
      <div className="max-w-2xl mx-auto p-6 text-center text-red-600">
        <h1 className="text-2xl font-bold mb-4">Error loading ticket</h1>
        <p>{err.response?.data?.message || "Unknown error occurred."}</p>
      </div>
    );
  }
}
