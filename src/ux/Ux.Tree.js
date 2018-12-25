import Type from './Ux.Type';
import Util from './util';
import {DataLabor} from "entity";
import Ux from "ux";
import U from 'underscore';

/**
 * 构造一颗专用的树桩结构，用于表格的处理，config的配置项如下
 *
 *      ...
 *      {
 *          "id":"用于构造树的记录主键，默认值为id",
 *          "pid":"用于构造树的父节点字段，默认值为pid",
 *          "value":"用于构造树的记录值，默认值为value",
 *          "label":"默认用于构造树的呈现字段，默认值为label",
 *          "expr":"如果该值支持表达式结构，则使用exprLabel代替label",
 *          "sort":"当前Tree中节点的排序字段，没有默认值"
 *      }
 * 数组中必须包含`level`字段：树的深度字段，必须包含该值，使用该值进行树的运算。
 * @method tree
 * @param {Array} array 原始数组
 * @param {Object} config 构造时的树的配置信息
 * @return {DataTree | *}
 */
const tree = (array = [], config = {}) => DataLabor.getTree(array, config).to();

const _setChildren = (array = [], current = {}) => {
    // 设置当前节点的children节点
    const children = array.filter(item => item.parentId === current.key);
    if (0 < children.length) {
        current.children = children;
        // 针对每个children设置
        current.children.forEach(child => _setChildren(array, child));
    }
};
const treeWithChildren = (array = []) => {
    // 构造Ant树
    const roots = array.filter(item => !item.parentId);
    // 构造一个以children为子节点的tree结构
    roots.forEach(root => _setChildren(array, root));

    return roots;
};
/**
 * key / parentId 两个核心主键
 * @param {Array} array 原始数组
 * @param {Object} config 配置信息
 */
const treeTable = (array = [], config = {}) => {
    // 构造Ant树
    const roots = treeWithChildren(array);
    // 添加_counter
    roots.forEach(root => treeCounter(root, 1));
    // 追加_level
    const data = Ux.treeFlat(roots);
    // 直接针对table进行处理，主要是处理columns = []
    data.forEach(dataItem => dataItem.key = Util.randomUUID());
    // 处理treeColumns
    const table = treeTableColumns(config);
    // 计算table专用
    treeTableCalc(data, table);
    // 最终结果
    return {data, table};
};
const treeTableCalc = (flatted = [], table = {}) => {
    // 驱动最大的level
    const counterContainer = {};
    table.columns.forEach(column => {
        // 包含列的渲染处理
        column.render = (text, record) => {
            const currentRowSpan = record[`${column.level}._counter`];
            const rowKey = record[`${column.level}.key`];
            const checkKey = `${column.dataIndex}-${rowKey}`;
            if (counterContainer[checkKey]) {
                // 解决空行问题
                return text ? {
                    children: text,
                    props: {
                        rowSpan: 0
                    }
                } : {
                    children: text,
                    props: {
                        rowSpan: 1
                    }
                };
            } else {
                counterContainer[checkKey] = true;
                let rowSpan = 0 === currentRowSpan ? 1 : currentRowSpan;
                // 修正不渲染的问题
                if (undefined === rowSpan) {
                    rowSpan = 1;
                }
                return {
                    children: text,
                    props: {
                        rowSpan
                    }
                };
            }
        };
        if (!column.hasOwnProperty('sorter')) {
            column.sortOrder = false;
        }
    });
};
const treeTableColumns = (table = {}) => {
    table.pagination = false;  // 关闭分页
    table.bordered = true; // 带上边框
    if (table && U.isArray(table.columns)) {
        table.columns.forEach((column) => {
            // 是否level开始
            const level = String(column.level ? column.level : null);
            // level有值才处理
            if (level) {
                if (!column.dataIndex.startsWith(`${level}.`)) {
                    column.dataIndex = `${level}.${column.dataIndex}`;
                }
            }
        });
    } else {
        table = {columns: []};
    }
    return table;
};
const treeFlat = (data = [], level = 1) => {
    let flatObjects = [];
    data.forEach((dataItem = {}) => {
        const item = {};
        const {children, ...rest} = dataItem;
        Ux.itObject(rest, (field, value) => item[`${level}.${field}`] = value, true);
        // 最后处理children
        if (!children || 0 === children.length) {
            // 有记录信息
            flatObjects.push(item);
        }
        if (children && 0 < children.length) {
            const flattedObjects = treeFlat(children, (level + 1));
            flattedObjects.forEach(flattedItem => {
                const $item = Ux.clone(item);
                flatObjects.push(Object.assign($item, flattedItem));
            });
        }
    });
    return flatObjects;
};
const treeCounter = (item = [], level = 1) => {
    if (item.hasOwnProperty("children") && item.children) {
        let validArray = item.children.filter(each => !each.children ||
            0 === each.children.length);
        let continueArray = item.children.filter(each => each.children &&
            0 < each.children.length);
        let counter = validArray.length;
        if (0 < continueArray.length) {
            continueArray.forEach(continueItem => {
                treeCounter(continueItem, (level + 1));
                counter += continueItem._counter;
            });
        }
        validArray.forEach(validItem => treeCounter(validItem, (level + 1)));
        item._counter = counter;
    } else {
        item._counter = 0;
    }
    item._level = level;
};
/**
 * 带过滤条件的Tree专用，内置调用tree方法
 * @method treeWithFilters
 * @param {Array} array 原始数组
 * @param filters 过滤条件
 * @param {Object} config 构造时的树的配置信息
 * @return {DataTree|*}
 */
const treeWithFilters = (array = [], filters = {}, config = {}) =>
    tree(Type.elementMatch(array, filters), config);
export default {
    // 树的构造方法
    tree,
    /**
     * 将一个array = []直接转换成一个treeTable专用的数组
     * 返回
     * {
     *     data: [], // 数据
     *     config: {}, // table的配置
     * }
     */
    treeTable,
    treeTableColumns,
    treeTableCalc, // 在上边结果之上计算出一个完整的TreeTable
    /**
     * 将一个array = []中转换成一个带有children节点的树
     * id字段名称：key
     * parentId字段名称：parentId
     */
    treeWithChildren,
    /**
     * 为一个array = []的树结构（包含了children字段）构造每一层的元数据
     * _counter：当前节点所有子节点数量（包含孙节点）
     * _level：当前节点的级别
     */
    treeCounter,
    /**
     * 将一个带有children的树结构拉平成一个数组，每一级包含一个相关字段
     */
    treeFlat,
    // 将数组中的_counter, _level加进去
    treeWithFilters
};