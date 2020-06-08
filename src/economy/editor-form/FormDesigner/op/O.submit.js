import Ux from 'ux';
import St from './O.submit.data';
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
/*
 *
 * field,           // 字段名
 * optionJsx,       // 配置项
 * optionConfig,    // 验证规则
 * optionItem,      // 基础选项
 * span,            // 自动处理
 */
const $opDataOut = (normalized = {}, data = {}, reference) => {
    St.dataInit(normalized, data);
    /*
     * 基础配置
     * - field: 字段名
     * - label: 标签值
     * - optionItem.style: 宽度解析处理
     */
    St.dataField(normalized, data);
    return normalized;
}
export default {
    $opDataIn,
    $opSaveSetting: (reference) => (params = {}) => {
        reference.setState({$loading: false, $submitting: false});
        /* 输出数据信息 */
        const normalized = {};
        const parameters = $opDataOut(normalized, params, reference);
        console.info(parameters);
    }
}