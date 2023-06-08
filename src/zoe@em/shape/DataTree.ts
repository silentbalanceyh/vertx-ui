import DataContainer from "./DataContainer";
import __Zn from "../zero.module.dependency";

const _calculateChildren = (multi: any, data: any, meta: any = {}) => {
    // 遍历数组每一个元素
    multi.forEach((current: any) => {
        // 读取该元素的子元素
        const child = data.filter(
            (item: any) => current["id"] === item["pid"]
        );
        // 存在子元素，递归往下
        if (0 < child.length) {
            current.children = (meta.sort) ?
                child.sort((left, right) => __Zn.sorterAsc(left, right, meta.sort)) : child;
            _calculateChildren(child, data, meta);
        }
    });
};

class DataTree implements DataContainer {
    ready: boolean = false;
    data: string = "";
    tree: Array<Object> = [];
    treeRoot: Array<Object> = [];       // 当前树的根节点

    constructor(data: Array<Object> = [], config: any = {}) {
        this.data = __Zn.wayO2S(data);       // 存储 raw
    }

    __type(): String {
        return __Zn.Env.E_TYPE.DATA_TREE;
    }

    _(index: number): any {
        return this.tree[index];
    }

    is(): boolean {
        return this.ready;
    }

    raw(): Object {
        return JSON.parse(this.data);
    }

    to() {
        return __Zn.clone(this.data);
    }
}

export default DataTree;
