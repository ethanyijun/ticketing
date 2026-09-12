import axios, { AxiosInstance } from "axios";
import { headers, cookies } from "next/headers";

/**
 * Build an Axios client compatible with Next.js App Router.
 * Automatically handles server vs browser environments.
 */
export default async function buildClient(): Promise<AxiosInstance> {
  if (typeof window === "undefined") {
    // 🧠 Server-side (RSC, route handler, etc.)

    const headerList = await headers(); // immutable Headers
    const cookieStore = await cookies(); // immutable cookies

    // Convert headers() -> plain object
    const forwardedHeaders: Record<string, string> = {};
    headerList.forEach((value, key) => {
      forwardedHeaders[key] = value;
    });

    // Convert cookies() -> Cookie header string
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: {
        ...forwardedHeaders,
        Host: "ticketing.dev", // 👈 important for ingress routing
        Cookie: cookieHeader,
      },
      withCredentials: true,
    });
  }

  // 🧠 Client-side
  return axios.create({
    baseURL: "/", // Next.js proxy rewrites to /api
    withCredentials: true,
  });
}
