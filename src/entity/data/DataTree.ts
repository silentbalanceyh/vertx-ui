import DataContainer from "./DataContainer";
import * as Immutable from "immutable";
import Ux from "ux";

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
                child.sort((left, right) => Ux.sorterAsc(left, right, meta.sort)) : child;
            _calculateChildren(child, data, meta);
        }
    });
};

const _initDataArray = (data: any = [], meta: any = {}) => {
    data = Immutable.fromJS(data).toJS();
    if (!meta.id) meta.id = "id";
    if (!meta.value) meta.value = meta.id;
    if (!meta.label) meta.label = "label";
    if (!meta.pid) meta.pid = "pid";
    // treenode meta 所需要转换的字段根据AD可知，所以手动转换而处理expr
    data.map((item: any) => {
        item["id"] = item[meta.id];
        item["value"] = item[meta.value];
        if (meta.expr) {
            item["label"] = Ux.formatExpr(meta.expr, item);
        } else if (meta.label) {
            item["label"] = item[meta.label];
        } else {
            item["label"] = "";
        }
        item["pid"] = item[meta.pid];
    });
    return data;
};

class DataTree implements DataContainer {
    ready: boolean = false;
    data: string = "";
    tree: Array<Object> = [];

    constructor(data: Array<Object> = [], meta: any = {}) {
        data = _initDataArray(data, meta);
        this.data = JSON.stringify(data);
        // 按ParentId分组
        let $data = Immutable.fromJS(data);

        let level = $data.map((item: any) => item.get("level")).min();
        const roots = meta.sort ?
            $data.filter((item: any) => level === item.get("level"))
                .sortBy((item: any) => item.get(meta.sort))
                .toJS() :
            $data.filter((item: any) => level === item.get("level"))
                .toJS();
        // 从根节点往下处理
        const $keys = Immutable.fromJS(roots.map((item: any) => item["id"]));
        let left = $data.filter((item: any) => !$keys.contains(item.get("id"))).toJS();
        // 递归遍历roots读取children
        _calculateChildren(roots, left, meta);
        this.tree = roots;
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
        return Immutable.fromJS(this.tree).toJS();
    }
}

export default DataTree;
