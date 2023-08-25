import requestHook from "@/src/hooks/requestHook";
import router from "next/router";
import React, { useEffect } from "react";

function Signout() {
  const { requestData, formErrors } = requestHook(
    `/api/users/signout`,
    "post",
    () => {
      router.push("/");
    }
  );
  useEffect(() => {
    const fetchData = async () => {
      const data = await requestData({});
    };
    fetchData().catch(console.error);
  }, []);

  return <div>Signing you out...</div>;
}

export default Signout;
