import requestHook from "@/src/hooks/requestHook";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  password: string;
  email: string;
};

export default () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const { requestData, formErrors } = requestHook(
    `/api/users/signup`,
    "post",
    () => {
      reset();
      router.push("/");
    }
  );
  const router = useRouter();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await requestData({ ...data });
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center mt-12"
      >
        <div className="flex justify-center flex-col gap-3">
          <h2>Sign Up</h2>
          <label>Email</label>
          <div>
            <input
              className="focus:shadow-outline text-white h-8 cursor-pointer rounded-lg bg-sky-500 px-4 text-sm transition-colors duration-150 hover:bg-sky-600"
              {...register("email", { required: true })}
            />
          </div>
          <label>Password</label>
          <div>
            <input
              type="password"
              className="focus:shadow-outline text-white h-8 cursor-pointer rounded-lg bg-sky-500 px-4 text-sm transition-colors duration-150 hover:bg-sky-600"
              {...register("password", { required: true })}
            />
          </div>

          <input
            className="focus:shadow-outline text-indigo-00 h-8 cursor-pointer rounded-lg bg-sky-500 px-4 text-sm transition-colors duration-150 hover:bg-sky-600"
            type="submit"
            value="Submit"
          />
        </div>
        {formErrors}
      </form>
    </>
  );
};
