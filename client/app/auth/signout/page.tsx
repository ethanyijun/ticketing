"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import requestHook from "@/src/hooks/requestHook";

export default function SignoutPage() {
  const router = useRouter();
  const { requestData, formErrors } = requestHook(
    `/api/users/signout`,
    "post",
    () => {
      router.replace("/auth/signin");
      router.refresh();
    }
  );

  useEffect(() => {
    const signOut = async () => {
      await requestData({});
    };
    signOut().catch(console.error);
  }, [requestData]);

  return (
    <div className="flex flex-col justify-center items-center mt-12">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Signing you out...</h2>
        {formErrors && <div className="mt-3 text-red-500">{formErrors}</div>}
      </div>
    </div>
  );
}
