import Axios from "axios";

export default async function call({
  method = "get",
  url,
  data,
  responseType = "json",
  params,
  cbSuccess,
  cbError,
  cbFinally
}) {
  const config = { method, responseType, url: `/api${url}` };
  if (data) config.data = data;
  if (params) config.params = { ...config.params, ...params };

  try {
    const res = await Axios(config);
    return res;
  } catch (err) {
    console.log("api err: ", err);
    cbError && cbError(err);
  } finally {
    cbFinally && cbFinally();
  }
}
