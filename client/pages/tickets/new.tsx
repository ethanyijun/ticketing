import buildClient from "@/api/build-client";
import requestHook from "@/src/hooks/requestHook";
import router from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  price: number;
  title: string;
  availableTickets: number;
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
        className="flex flex-col justify-center items-center bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
      >
        <h2 className="text-2xl font-bold mb-6">Create a ticket</h2>

        <div className="flex flex-col w-full gap-4 mb-4">
          <div className="flex flex-col">
            <label className="mb-2 text-gray-700">Title</label>
            <input
              className="focus:shadow-outline h-10 rounded-lg bg-gray-100 px-4 text-gray-900 border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-150"
              {...register("title", { required: true })}
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-gray-700">Price</label>
            <input
              className="focus:shadow-outline h-10 rounded-lg bg-gray-100 px-4 text-gray-900 border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-150"
              {...register("price", { required: true })}
              onBlur={(e) =>
                e.target.value === ""
                  ? ""
                  : setValue("price", +parseFloat(e.target.value).toFixed(2))
              }
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 text-gray-700">Availability</label>
            <input
              className="focus:shadow-outline h-10 rounded-lg bg-gray-100 px-4 text-gray-900 border border-gray-300 focus:outline-none focus:border-blue-500 transition duration-150"
              {...register("availableTickets", { required: true })}
              onBlur={(e) =>
                e.target.value === ""
                  ? ""
                  : setValue("availableTickets", +parseInt(e.target.value))
              }
            />
          </div>
        </div>

        <input
          className="mt-4 w-full h-10 rounded-lg bg-blue-500 text-white font-bold cursor-pointer hover:bg-sky-500 focus:outline-none focus:shadow-outline transition duration-150"
          type="submit"
          value="Submit"
        />

        {formErrors && <div className="mt-4 text-red-500">{formErrors}</div>}
      </form>
    </>
  );
};

export async function getServerSideProps(context: any) {
  const clientInstance = buildClient(context);
  const response = await clientInstance.get("/api/users/currentuser");
  return { props: { ...response.data } };
}
