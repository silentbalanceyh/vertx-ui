import Ux from 'ux';
import Ex from 'ex';

const yoForm = (reference) => {
    /* 表单数据 */
    const config = Ux.fromHoc(reference, "form");
    /* 初始化状态专用，格式化form信息 */
    const user = Ux.isLogged();
    const inited = {};
    inited.key = user.key;
    inited.username = user.username;
    /* 合并配置 */
    return Ex.U.yoForm(reference, {
        form: config,
    }, inited);
};
const $opPassword = (reference) => (event) => {
    console.info($opPassword);
};
export default {
    yoForm,
    actions: {
        $opPassword
    }
}