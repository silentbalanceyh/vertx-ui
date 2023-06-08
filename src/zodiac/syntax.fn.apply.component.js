import __Zn from './zero.module.dependency';

const applyColumn = (item = {}) => {
    if (item.hasOwnProperty('key')) {
        delete item.key;
    }
    if (item.hasOwnProperty("sorter")) {
        item.sorter = Boolean(item.sorter);
    }
    return item;
}
const applyRow = (row = {}, addition = {}, config) => {
    const style = row.style ? row.style : {};
    if (1 === row.length) {
        // 单按钮
        const item = row[0];
        if (item.field === __Zn.Env.K_NAME.BUTTON) {
            if (item.hidden) {
                style.display = "none";
            } else {
                style.width = "100%";
            }
        }
        /*
         * 标题单行修正间距专用，但此处需设置title对应的基础配置
         * 新版走SCSS直接控制，此处不再需要 36px 高度，否则造成 description 部分有问题
         */
        // if (item.title) {
        //     style.height = `36px`;
        // }
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
    config = __Zn.clone(config);
    if (!config.mode) config.mode = "pure";
    if (!config.meta) config.meta = {};
    if (!config.field) config.field = field;
    return config;
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
export default {
    applyColumn,
    applyRow,
    applyView,
    applyRender,
}