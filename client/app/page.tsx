// app/page.tsx
import buildClient from "@/api/build-client";
import TicketListClient from "@/src/components/ticketListClient";

export default async function HomePage() {
  const client = await buildClient();

  try {
    // Fetch both concurrently
    const [currentUserRes, ticketsRes] = await Promise.all([
      client.get("/api/users/currentuser"),
      client.get("/api/tickets"),
    ]);

    const currentUser = currentUserRes.data?.currentUser ?? null;
    const tickets = ticketsRes.data ?? [];

    return (
      <div className="max-w-5xl mx-auto p-6">
        <TicketListClient tickets={tickets} currentUser={currentUser} />
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
