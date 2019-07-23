const _generate = (code, info, error) => () => Promise.reject({code, error, info});
const error001 = _generate(-200001, "应用程序数据读取失败！",
    "Application ( X_APP ) Has not been initialized ！");
const error002 = _generate(-200002, "当前组件中未使用 Ant Design中的Form进行封装，请检查！",
    "Ant Design `form` variable was missing, please check your code !");
const error003 = _generate(-200003, "当前流程要求 Promise 类型，但检测到非 Promise！",
    "Promise type in workflow required in current position.");
export default {
    error001,
    error002,
    error003,
}