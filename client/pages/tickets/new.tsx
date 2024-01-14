import buildClient from "@/api/build-client";
import requestHook from "@/src/hooks/requestHook";
import router from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  price: number;
  title: string;
};

export default () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<Inputs>();
  const { requestData, formErrors } = requestHook(
    `/api/tickets`,
    "post",
    () => {
      reset();
      router.push("/");
    }
  );
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await requestData({ ...data });
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center mt-12"
      >
        <div className="flex justify-center flex-col gap-3">
          <h2>Create a ticket</h2>
          <label>Title</label>
          <div>
            <input
              className="focus:shadow-outline text-white h-8 cursor-pointer rounded-lg bg-sky-500 px-4 text-sm transition-colors duration-150 hover:bg-sky-600"
              {...register("title", { required: true })}
            />
          </div>
          <label>Price</label>
          <div>
            <input
              className="focus:shadow-outline text-white h-8 cursor-pointer rounded-lg bg-sky-500 px-4 text-sm transition-colors duration-150 hover:bg-sky-600"
              {...register("price", {
                required: true,
              })}
              onBlur={(e) =>
                setValue("price", +parseFloat(e.target.value).toFixed(2))
              }
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

export async function getServerSideProps(context: any) {
  const clientInstance = buildClient(context);
  const response = await clientInstance.get("/api/users/currentuser");
  return { props: { ...response.data } };
}
