/**
 * 处理Form中的Item的options选项构造配置信息
 * @method optionFormItem
 * @param item 配置数据
 * @return {*}
 */
const optionFormItem = (item = {}) => {
    return (item.labelCol) ? item : {
        ...item,
        style: {
            width: "90%"
        },
        labelCol: {
            span: 8
        },
        wrapperCol: {
            span: 16
        }
    }
};
/**
 * @class Option
 * @description 配置项专用静态处理类
 */
export default {
    optionFormItem
}
