// app/layout.tsx
import "../styles/global.css";
import ReduxProvider from "@/src/providers/ReduxProvider";
import buildClient from "@/api/build-client";
import Header from "@/src/components/header";
import PageLayout from "@/src/components/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ticketing",
  description: "Ticketing app 🧐",
};

// Authentication is request-specific, so this tree must never be prerendered.
export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let currentUser = null;

  try {
    const client = await buildClient();
    const { data } = await client.get("/api/users/currentuser");
    currentUser = data?.currentUser || null;
  } catch (err) {
    console.error("❌ Failed to fetch currentUser:", err);
    currentUser = null;
  }

  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Header currentUser={currentUser} />
          <PageLayout>{children}</PageLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
