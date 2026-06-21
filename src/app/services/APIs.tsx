import instance from "./axiosinstance";
import staticsData from "./StaticsData";

const baseURL = staticsData.baseUrl;

export const APIs = {
  authServiceApi: `${baseURL}/api/auth`,
  taskServiceApi: `${baseURL}/api/tasks`,
};

export const downloadurl = instance?.defaults?.baseURL;
