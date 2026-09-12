"use client";

import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import requestHook from "@/src/hooks/requestHook";

type Inputs = {
  email: string;
  password: string;
};

export default function SigninPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const { requestData, formErrors } = requestHook(
    `/api/users/signin`,
    "post",
    () => {
      reset();
      router.replace("/");
      router.refresh();
    }
  );

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await requestData({ ...data });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center items-center mt-12"
    >
      <div className="flex justify-center flex-col gap-3 w-80">
        <h2 className="text-2xl font-semibold mb-4 text-center">Sign In</h2>

        <label className="text-gray-700">Email</label>
        <input
          type="email"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          {...register("email", { required: true })}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">Email is required</span>
        )}

        <label className="text-gray-700 mt-3">Password</label>
        <input
          type="password"
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          {...register("password", { required: true })}
        />
        {errors.password && (
          <span className="text-red-500 text-sm">Password is required</span>
        )}

        <button
          type="submit"
          className="mt-5 h-10 rounded-lg bg-sky-500 text-white font-semibold hover:bg-sky-600 transition duration-150"
        >
          Submit
        </button>

        {formErrors && <div className="mt-3 text-red-500">{formErrors}</div>}
      </div>
    </form>
  );
}
