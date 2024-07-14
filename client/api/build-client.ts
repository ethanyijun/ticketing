import axios from "axios";

export default ({ req }: { req: any }) => {
  if (typeof window === "undefined") {
    console.log("We are on the server");
    return axios.create({
      //www.ethangai.xyz
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: { ...req.headers, Host: "ticketing.dev" },
      // baseURL: "http://ticketing.dev/",
      // headers: { ...req.headers, Host: "ticketing.dev" },
    });
  } else {
    console.log("We are on the browser");
    return axios.create({
      baseURL: "/",
    });
  }
};
