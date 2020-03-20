/*
 * 计算 $items 中的数据，直接计算生成最终的元素规范化操作
 */
import Ux from "ux";

const g6Element = (each = {}, config = {}) => {
    const {
        /*
         * {
         *     "shape": "",
         *     "size": ""
         * }
         */
        model = {},
    } = config;
    return {
        id: each.key,
        label: each.text,
        data: {
            ...Ux.clone(each.data),
            icon: each.image,
        },
        ...model,
    };
};
const g6ElementItems = (models = [], config = {}) => {
    const {
        /*
         * {
         *     "width":"",
         *     "height": ""
         * }
         */
        image = {}
    } = config;
    const normalized = [];
    /* 直接处理 normalized */
    models.forEach(each => {
        /* 拨开 */
        const {data, ...rest} = each;

        const item = {};
        /* item 属性处理 */
        item.key = each.key;
        item.className = `item item-${each.level}`;
        item.model = g6Element(each, config);
        const element = {};
        element.item = item;

        /* 处理顶层数据 */
        element.text = each.text;
        element.data = Ux.clone(data);
        element.meta = rest;
        element.identifier = data.identifier;

        /* 处理图片数据 */
        element.img = {
            src: each.image,
            draggable: true,
            ...image
        };
        normalized.push(element);
    });
    return normalized;
};
const g6ElementNodes = (models = [], config = {}) => {
    const normalized = [];
    models.map(each => g6Element(each, config))
        .forEach(each => normalized.push(each));
    return normalized;
};
export default {
    g6ElementItems,
    g6ElementNodes
}