import request from "../utils/request";

/**
 * 打包Vue
 */
export function buildVue(data) {
  let query = "?";
  Object.keys(data).map((key) => {
    query += `${key}=${data[key]}`;
  });
  return request({
    url: "/vue" + query,
    method: "get",
    responseType: "blob",
  });
}

/**
 * 打包react
 */
export function buildReact(data) {
  let query = "?";
  Object.keys(data).map((key) => {
    query += `${key}=${data[key]}`;
  });
  return request({
    url: "/react" + query,
    method: "get",
    responseType: "blob",
  });
}
export function execCommand(data) {
  return request({
    url: "/command",
    method: "post",
    data,
  });
}
