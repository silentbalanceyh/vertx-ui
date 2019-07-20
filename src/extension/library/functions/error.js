const error001 = () => Promise.reject({
    code: -200001,
    error: "Application ( X_APP ) Has not been initialized ！",
    info: "应用程序数据读取失败！"
});
export default {
    error001
}