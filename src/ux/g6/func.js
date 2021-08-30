import Abs from '../abyss';
import Ele from '../element';
import Eng from '../engine';
import T from '../unity';
import {GEvent} from './event';

const g6PageInit = (reference, onInit) => {
    const state = {};
    /*
     * 通用树形：
     * - $visible，是否打开弹窗，弹窗状态。
     * - $submitting，防重复提交（正在提交）
     * - $inited，如果打开窗口是表单则表示表单的初始化数据信息
     */
    state.$submitting = false;
    state.$visible = false;
    state.$inited = undefined;
    /*
     * 构造 GEvent
     */
    state.$gEvent = GEvent.create(reference);
    onInit(reference, state).then(processed => {
        // 准备完成
        processed.$ready = true;
        reference.setState(processed);
    })
};
const g6PageUp = (reference, virtualRef, onInit) => {
    const {data} = reference.props;
    const $previous = virtualRef.props.data;
    if (data && $previous) {
        if (Abs.isDiff($previous, data)) {
            /*
             * 重新刷新，只要 data 发生改变则执行刷新
             */
            reference.setState({$ready: false});
            const startState = Abs.clone(reference.state);
            onInit(reference, startState).then(state => {
                state.$ready = true;
                reference.setState(state);
            })
        }
    }
};

/*
 * 验证当前的边是否存在重复
 */
const x6IsDupEdge = (edge, graph) => {
    if (edge) {
        const source = edge.getSourceNode();
        const target = edge.getTargetNode();
        // 读取图中所有的节点
        const found = graph.getEdges()
            // 过滤掉自身
            .filter(each => each.id !== edge.id)
            .filter(each => {
                const nodeSrc = each.getSourceNode();
                return (nodeSrc && source) ? source.id === nodeSrc.id : false;
            })
            .filter(each => {
                const nodeTag = each.getTargetNode();
                return (nodeTag && target) ? target.id === nodeTag.id : false;
            })
            // 这里需要执行数据信息
            .length;
        // 找到对应信息，则边线重复
        return (0 < found);
    } else {
        throw new Error("对不起，元素不可为空！！");
    }
}
const x6IsFree = (graph) => {
    const nodes = graph.getNodes();
    const edges = graph.getEdges();
    // 从节点计算
    const nodeSet = new Set();
    nodes.forEach(node => nodeSet.add(node.id));
    // 从边计算
    edges.forEach(edge => {
        const source = edge.getSourceNode();
        const target = edge.getTargetNode();
        nodeSet.delete(source.id);
        nodeSet.delete(target.id);
    });
    // 计算最终结果
    return (0 < Array.from(nodeSet).length)
}


/*
 * 模型 / 分类计算
 * 1）模型中 metadata.relation = true
 * 2）分类中如果没有 metadata.image 就直接使用 identifier 计算，如果有，则直接 metadata.image
 * 3）处理 Data Model 相关信息，元素为 treeArray 的结果
 * 每个元素的数据结构
 * {
 *      "text": "显示文本",
 *      "title": "显示文本",
 *      "key": "主键",
 *      "parent": "父键",
 *      "value": "值节点",
 *      "sort": "排序字段",
 *      "leaf": "是否叶节点",
 *      "level": "当前节点所在层级",
 *      "sequence": "顺序（计算出来的，可按该字段排序）",
 *      "icon": "图标路径，最终可以被 fnImage 解析",
 *      "data": {
 *           "...field": "所有字段信息"
 *      }
 * }
 * 构造树形分类信息，提取关系数据
 */
const g6DataTree = (reference, config = {}) => {
    const {model = "resource.models", category = "graphic.nodes"} = config;
    const models = Eng.onDatum(reference, model);
    let categoryList = Eng.onDatum(reference, category);
    /*
     * 模型列表处理
     */
    const $identifiers = models
        .filter(item => !!item.metadata)
        .filter(item => item.metadata.relation)
        .map(item => item.identifier);
    /*
     * 先转换数据源
     */
    categoryList = categoryList.map(g6Image('icon'));
    /*
     * category 中过滤，并且追加排序因子
     */
    const treeArray = T.toTreeArray(categoryList, {text: "name", title: "name"});
    const $source = Abs.clone(treeArray);
    treeArray.forEach(each => {
        const branch = Ele.elementBranch($source, each.key).map(item => item.sort);
        /*
         * 重算 sort 因子
         * length = 3 （叶子节点）
         * length = 2 （中间节点）
         * length = 1 （根节点）
         */
        each.level = branch.length;
        if (2 === branch.length) {
            branch.push(0);
        }
        if (1 === branch.length) {
            branch.push(0);
            branch.push(0);
        }
        let level = "";
        branch.forEach(each => {
            if (each < 10) {
                level += `0${each}`
            } else {
                level += `${each}`
            }
        });
        each.sequence = Ele.valueInt(level);
    });
    /*
     * 排序过滤运算
     */
    return treeArray
        .sort((left, right) => left.sequence - right.sequence)
        .filter(each => $identifiers.includes(each.data.identifier));
};
const g6Image = (fieldImage = 'image') => {
    return (item = {}) => {
        // 在 item 对象中追加 fieldImage 指定的字段信息
        let image;
        const {metadata} = item;
        if (metadata && metadata.image) {
            // 1. 优先考虑 metadata 配置中的 image 字段
            image = metadata.image;
        } else {
            // 2..最简单直接的配置处理
            image = '/img/ox/ci/' + item.identifier + ".png";
        }
        item[fieldImage] = image;
        return item;
    }
}

const x6FromTo = (edge, field) => {
    const source = edge.getSourceNode().getData();
    const target = edge.getTargetNode().getData();
    if (source && target) {
        if (field) {
            // 有字段名，则提取字段名处理
            return [source[field], target[field]];
        } else {
            // 无字段名，直接提取节点信息
            return [source, target];
        }
    } else {
        // 返回两个 undefined
        return [undefined, undefined];
    }
}
export default {
    g6PageInit,
    g6PageUp,

    /**
     * 当前这条边是否重复的边
     * 验证
     */
    x6IsDupEdge,
    x6IsFree,

    // 数据部分
    g6DataTree,

    // 读取 source 和 target
    x6FromTo,

    // 节点执行
    g6Image,
}