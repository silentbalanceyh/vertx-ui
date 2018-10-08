import Ux from 'ux';
import * as U from 'underscore';

const _applyColor = (item: any = {}) => {
    item.key = Ux.randomUUID();
    if (item.title) {
        if (item.title.startsWith("UC")) {
            item.color = "#06c";
        } else if (item.title.startsWith("UI")) {
            item.color = "#693";
        } else if (item.title.startsWith("UT")) {
            item.color = "#bc0981";
        } else if (item.title.startsWith("AI")) {
            item.color = "#990"
        } else if (item.title.startsWith("UE")) {
            item.color = "#963";
        } else if (item.title.startsWith("UL")) {
            item.color = "#4090f7";
        } else {
            item.color = "#333";
        }
    }
};

const _analyzeTree = (children = []) => {
    const result = Ux.clone(children);
    children.forEach((each, index) => {
        if ("string" === typeof each) {
            // 如果是String则只能是子节点
            const item: any = {};
            const eachArr = each.split(',');
            item.title = eachArr[0];
            if (eachArr[1]) item.uri = `/${Ux.Env.ROUTE}${eachArr[1]}`;
            result[index] = item;
            // 是否完成
            if (eachArr[2]) {
                item.finished = Boolean(eachArr[2]);
            } else {
                item.finished = false;
            }
            _applyColor(result[index]);
        } else {
            result[index] = Ux.clone(each);
            _applyColor(result[index]);
            // 继续往下递归处理
            if (U.isArray(each.children)) {
                result[index].children = _analyzeTree(each.children);
            }
        }
    });
    return result;
};

const calcPrefix = (index = 0, prefix) => {
    const seed = index + 1;
    if (seed < 10) {
        return `${prefix}000${seed}`;
    } else if (seed < 100) {
        return `${prefix}00${seed}`;
    } else if (seed < 1000) {
        return `${prefix}0${seed}`;
    } else {
        return `${prefix}${seed}`;
    }
};

const analyzeTree = (reference: any) => {
    const treeData = Ux.fromHoc(reference, "treedata");
    let $tree = Ux.clone(treeData);
    // 补充Title专用
    $tree.filter(each => each.hasOwnProperty('children')).forEach(each => {
        // 计算Prefix
        const prefix = each.title.replace(/ /g, '').split('-')[0];
        const children = [];
        each.children.filter(literal => "string" === typeof literal)
            .forEach((child, index) => {
                if (child.startsWith(prefix)) {
                    children.push(child);
                } else {
                    const sequence = calcPrefix(index, prefix);
                    children.push(sequence + ' - ' + child);
                }
            });
        each.children = children;
    });
    return _analyzeTree($tree);
};
const onRoute = (reference: any) => (key, selected, nodes) => {
    console.info(key, selected, nodes);
};
export default {
    analyzeTree,
    onRoute
}