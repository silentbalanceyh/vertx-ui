import Ux from "ux";

const getAttrs = (reference, field) => {
    // 解开状态相关数据
    // config -> optionJsx.config
    // value -> 传入的值
    // state -> 状态数据信息
    const {config = {}, ...meta} = reference.props;
    const value = reference.state;
    // 构造所需要的属性信息
    const attrs = {};

    // 计算特殊属性
    // addonAfter
    // placeholder
    if (config[field]) attrs.addonAfter = config[field];
    if (meta.placeholder) attrs.placeholder = meta.placeholder;

    // 风格计算专用
    attrs.style = {width: config.width ? config.width : 100};

    // 事件处理，onBlur主要为验证专用
    attrs.onChange = Ux.xt2Change(reference, field);
    attrs.onBlur = Ux.xt2Blur(reference, field);

    // 处理值相关信息
    attrs.value = value[field];
    // 合并处理
    return Object.assign({}, meta, attrs);
};

const getDefault = () => ({
    year: undefined,
    month: undefined,
    day: undefined,
    version: undefined
});
export default {
    getAttrs,
    getDefault
};