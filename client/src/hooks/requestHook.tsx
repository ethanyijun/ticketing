"use client";

import axios, { AxiosResponse } from "axios";
import { useCallback, useRef, useState } from "react";

type HttpMethod = "get" | "post" | "put" | "delete";

const useRequest = (
  url: string, // Base URL, can have placeholders like /api/tickets/:id
  method: HttpMethod,
  onSuccess?: (response?: AxiosResponse) => void
) => {
  const [formErrors, setFormErrors] = useState<any>(null);
  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  // Main function to handle requests
  const requestData = useCallback(
    async (
      body: Record<string, any> = {},
      pathParams?: Record<string, string>
    ) => {
      try {
        setFormErrors(null);

        // Replace path params in the URL if provided (e.g., { id: '123' })
        let dynamicUrl = url;
        if (pathParams) {
          dynamicUrl = Object.keys(pathParams).reduce((acc, key) => {
            return acc.replace(`:${key}`, pathParams[key]);
          }, url);
        }

        const response =
          method === "get"
            ? await axios.get(dynamicUrl, { params: body })
            : method === "delete"
              ? await axios.delete(dynamicUrl, { data: body })
              : await axios[method](dynamicUrl, body);

        onSuccessRef.current?.(response);
        return response.data;
      } catch (error: any) {
        setFormErrors(
          <div>
            <h4>Oops...</h4>
            <ul>
              {error.response?.data?.errors?.map((err: any, index: number) => (
                <li key={index}>{err.message}</li>
              ))}
            </ul>
          </div>
        );
        return undefined;
      }
    },
    [method, url]
  );

  return { requestData, formErrors };
};

export default useRequest;
