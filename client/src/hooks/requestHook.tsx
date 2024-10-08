import axios, { AxiosResponse } from "axios";
import { useState } from "react";

const requestHook = (
  url: string, // Base URL, can have placeholders like /api/tickets/:id
  method: string,
  onSuccess?: (response?: AxiosResponse) => void
) => {
  const [formErrors, setFormErrors] = useState<any>(null);

  // Define a dictionary for HTTP methods
  const methodDict: {
    [key: string]: (url: string, data?: any) => Promise<AxiosResponse<any>>;
  } = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
  };

  // Main function to handle requests
  const requestData = async (
    body: Record<string, any> = {},
    pathParams?: Record<string, string>
  ) => {
    try {
      // Replace path params in the URL if provided (e.g., { id: '123' })
      let dynamicUrl = url;
      if (pathParams) {
        dynamicUrl = Object.keys(pathParams).reduce((acc, key) => {
          return acc.replace(`:${key}`, pathParams[key]);
        }, url);
      }

      const response = await methodDict[method](dynamicUrl, body);
      if (onSuccess) {
        onSuccess(response);
      }
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
    }
  };

  return { requestData, formErrors };
};

export default requestHook;
