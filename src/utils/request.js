import axios from "axios";
import { Message } from "element-ui";
import Vue from "vue";

const instance = axios.create({
  baseURL: "/api",
  timeout: 300000,
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    Message.error("请求错误");
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    Message.error("服务器错误");
    return Promise.reject(err);
  }
);

Vue.prototype.$axios = instance;

export default instance;
