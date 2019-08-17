import Ux from "ux";
import Api from "../ajax";

const $opReset = (reference) => (event) => {
    event.preventDefault();
    Ux.formReset(reference);
};
const $opLogout = (reference) => Api.logout().then(result => {
    console.info("登出系统！", result);
    // 清除Session
    Ux.toLogout();
    // 路由处理
    Ux.toRoute(reference, Ux.Env.ENTRY_LOGIN);
    // 清除State上的数据
    Ux.eraseTree(reference, ['user']);
});
export default {
    $opReset,
    $opLogout,
}