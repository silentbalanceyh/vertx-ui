/*
 * 计算 $items 中的数据，直接计算生成最终的元素规范化操作
 */
import T from './O.data.model';
import Abs from '../../../abyss';
import Eng from '../../../engine';
import O from './O.node.js';

const g6Element = (node = {}, config = {}) => {
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
        id: node.key,
        label: node.text,
        icon: node.icon,
        data: {
            ...Abs.clone(node.data),
            // icon: each.image,
        },
        ...model
    };
    ;
};
/*
 * 双输入二义性方法
 */
const g6DataItems = (input = [], config = {}) => {
    if (Abs.isArray(input)) {
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
        input.forEach(each => {
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
            element.data = Abs.clone(each);
            element.meta = rest;
            element.identifier = data.identifier;

            /* 处理图片数据 */
            element.img = {
                src: each.icon,
                draggable: true,
                ...image
            };
            normalized.push(element);
        });
        return normalized;
    } else {
        const data = T.g6DataTree(input);
        return g6DataItems(data, config);
    }
};
const g6DataNodes = (nodes = [], config = {}) => {
    const normalized = [];
    nodes.map(each => g6Element(each, config))
        .forEach(each => normalized.push(each));
    return normalized;
};
const g6DataEdge = (edge, reference) => {
    const points = O.g6GetEdge(edge);
    const model = edge.getModel();
    /*
     * 构造记录集
     */
    const {sourceData, targetData} = points;
    const relationData = {};
    relationData.key = model.id;        //  key 测试
    relationData.upstream = sourceData['identifier'];
    relationData.downstream = targetData['identifier'];
    /*
     * 通用字段
     */
    relationData.language = sourceData['language'];
    relationData.active = true;
    relationData.sigma = sourceData['sigma'];
    const type = Eng.elementUniqueDatum(reference, "relation.type", 'name', model.label);
    if (type) {
        relationData.type = type.code;
    }
    return relationData;
};
const g6DataSelected = (reference) => {
    const {$items = []} = reference.state;

    const {$dropped = []} = reference.state;
    const droppedSet = Abs.immutable($dropped);
    /* 过滤 */
    return $items.filter(item => !droppedSet.contains(item.identifier));
};

export default {
    g6DataItems,
    g6DataSelected,
    g6DataNodes,
    g6DataEdge,
}