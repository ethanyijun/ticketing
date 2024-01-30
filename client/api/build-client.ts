import axios from "axios";

export default ({ req }: { req: any }) => {
  if (typeof window === "undefined") {
    console.log("We are on the server");
    return axios.create({
      baseURL: "http://www.ethangai.xyz/",
      headers: { ...req.headers, Host: "www.ethangai.xyz" },
    });
  } else {
    console.log("We are on the browser");
    return axios.create({
      baseURL: "/",
    });
  }
};
