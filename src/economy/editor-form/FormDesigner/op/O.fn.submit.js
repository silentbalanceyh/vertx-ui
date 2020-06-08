import Ux from 'ux';
/*
 * 基础字段
 * - aiAction
 * - aiTitle
 * - aiX
 */
const $opDataIn = (data = {}, reference) => {
    const $data = reference.props.data;
    const message = Ux.fromHoc(reference, "message");
    const {optionItem = {}} = data;
    /* 初始化 */
    const $inited = {};
    {
        // 外层输入的标签信息
        if (optionItem.label &&
            message.label !== optionItem.label) {
            $inited.label = optionItem.label;
        }
        $inited.render = $data.render;  // 当前 render
        $inited.allowClear = false;     // 不允许清空
    }
    return $inited;
}
const $opDataOut = (data = {}, reference) => {

}
export default {
    $opDataIn,
    $opSaveSetting: (reference) => (params = {}) => {
        Ux.dgFileJson(params, params.render);
        /* 输出数据信息 */
        const parameters = $opDataOut(params, reference);
    }
}