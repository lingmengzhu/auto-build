import request from "../utils/request";

/**
 * 打包Vue
 */
export function buildVue(data) {
  return request({
    url: "/vue",
    method: "get",
    data,
    responseType: 'blob'
  });
}

/**
 * 打包react
 */
export function buildReact(data) {
  return request({
    url: "/react",
    method: "get",
    data,
    responseType: 'blob'
  });
}
