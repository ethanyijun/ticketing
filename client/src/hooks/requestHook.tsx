import axios, { AxiosResponse, AxiosInstance } from "axios";
import { useState } from "react";

const requestHook = (
  url: string,
  method: string,
  onSuccess?: (response?: AxiosResponse) => void
) => {
  const [formErrors, setFormErrors] = useState<any>(null);
  const methodDict: {
    [key: string]: (url: string, data?: any) => Promise<AxiosResponse<any>>;
  } = {
    get: axios.get,
    post: axios.post,
    put: axios.put,
    delete: axios.delete,
  };

  const requestData = async (body: Record<string, any>) => {
    try {
      const response = await methodDict[method](url, body);
      onSuccess && onSuccess(response);
      return response.data;
    } catch (error: any) {
      setFormErrors(
        <div>
          <h4>Ooops...</h4>
          <ul>
            {error.response.data.errors.map((error: any, index: number) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { requestData, formErrors };
};

export default requestHook;
