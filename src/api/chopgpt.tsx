import axios from "axios";

const url = import.meta.env.VITE_URL_PROD + "/chopgpt";

const token = import.meta.env.VITE_TOKEN;

export const chopGPT = async (text: string) => {
  const response = await axios.post(url, {
    token,
    query: text,
  });
  return response.data;
};
