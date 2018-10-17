import Log from "../monitor/Mt.Logger";
import Sign from "../util/Ux.Sign";

/**
 * Ajax日志函数，打印请求过程中的日志信息
 * @method _logAjax
 * @private
 * @param api 当前Ajax请求的Uri路径
 * @param method 当前Ajax使用的HTTP方法
 * @param params 当前Ajax请求的参数信息
 * @param mockData 【Mock环境可用】当前Ajax请求的Mock数据
 */
const ajaxLog = (api, method, params, mockData = {}) => {
    if ((mockData && mockData.mock) || mockData['forceMock']) {
        Log.mock(params, mockData.data, method + " " + api);
    } else {
        Log.request(api, method, params, Sign.token());
    }
};

export default {
    ajaxLog,
};