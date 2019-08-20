import Yo from './yo';
import Ux from "ux";
/*
 * config 说明
 * {
 *      "fieldColumn": {
 *          字段配置
 *      },
 *      "valueColumn": {
 *          值列配置
 *      },
 *      "button": 隐藏Button
 *      "modal":{
 *          "error"：验证
 *          "success": 成功
 *      }
 * }
 */
const yiEditor = (reference) => {
    const {config = {}} = reference.props;
    /* 列处理 */
    let $columns = [];
    $columns.push(Yo.yiOp(reference, config));
    $columns.push(Yo.yiField(reference, config));
    $columns.push(Yo.yiValue(reference, config));
    // 初始化数据
    const $data = [{key: Ux.randomUUID()}];
    reference.setState({$columns, $data, $ready: true})
};
export default {
    yiEditor
}