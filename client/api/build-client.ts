import axios from "axios";

export default ({ req }: { req: any }) => {
  if (typeof window === "undefined") {
    // We are on the server
    console.log("We are on the server");
    return axios.create({
      baseURL: "http://www.ethangai.xyz/",
      headers: { ...req.headers, Host: "www.ethangai.xyz" },
      // headers: req.headers,
    });
  } else {
    console.log("We are on the browser");

    // We must be on the browser
    return axios.create({
      baseURL: "/",
    });
  }
};
