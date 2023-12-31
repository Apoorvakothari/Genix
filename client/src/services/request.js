import { getToken } from "./user";

const request = async (url, method = "GET", payload = null) => {
  const options = { method };
  if (payload) {
    options.headers = { "Content-Type": "application/json" };
    options.body = JSON.stringify(payload);
    if (method === "DELETE" || method === "PUT") {
      url += `?_method=${method}`;
    }
  }

  const token = getToken();
  if (token) {
    options.headers ||= {};
    options.headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, options);
  if (res.ok) return res.json();
  throw new Error("Bad Request");
};

export default request;
