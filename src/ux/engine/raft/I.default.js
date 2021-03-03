import Value from '../../element';

/**
 * 验证规则属性
 * message：校验文件
 * type: 可选（内建类型）
 * required：是否必填
 * len:字段长度
 * min:最小长度
 * max:最大长度
 * enum: 枚举类型
 * pattern:正则表达式校验
 * transform:校验前转换字段值
 * validator: 自定义校验
 * @method _uiDisplay
 * @private
 * @param row 显示行数据
 * @param addition 额外风格
 * @param config
 * **/
const applyRow = (row = {}, addition = {}, config) => {
    const style = row.style ? row.style : {};
    if (1 === row.length) {
        // 单按钮
        const item = row[0];
        if (item.field === "$button") {
            if (item.hidden) {
                style.display = "none";
            } else {
                style.width = "100%";
            }
        }
        // 标题单行修正间距专用
        if (item.title) {
            style.height = `36px`;
        }
    }
    // style.paddingBottom = 5;
    // Row的高度修正
    if (config.hasOwnProperty('rowHeight')) {
        // 不能直接用height，防止垮行字段
        style.minHeight = config.rowHeight;
    }
    return Object.assign(addition, style);
};
const applyView = (config = {}, field) => {
    // 智能格式兼容
    if ("string" === typeof config) {
        const splitted = config.split(',');
        if (2 === splitted.length) {
            const key = splitted[0];
            const label = splitted[1];
            const target = {};
            target.field = field;
            target.label = label;
            if (key !== field) {
                target.path = key;
            }
            config = target;
        } else {
            const target = {};
            target.field = field;
            target.label = splitted[0];
            config = target;
        }
    } else if (true === config) {
        const target = {};
        target.field = field;
        config = target;
    }
    config = Value.clone(config);
    if (!config.mode) config.mode = "pure";
    if (!config.meta) config.meta = {};
    if (!config.field) config.field = field;
    return config;
};
const applyInited = (reference) => {
    let values = {};
    if (reference.props['$inited']) {
        values = reference.props['$inited'];
    } else {
        values = {};
    }
    return values;
};
const applyRender = (renders = {}, code) => {
    if (code) {
        const dynamic = {};
        // eslint-disable-next-line
        for (const field in renders) {
            if (renders.hasOwnProperty(field)) {
                const target = `children.${code}.${field}`;
                dynamic[target] = renders[field];
            }
        }
        return dynamic;
    } else {
        return renders;
    }
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // 读取表单默认值
    applyInited,
    applyRow,
    applyView,
    applyRender,
};