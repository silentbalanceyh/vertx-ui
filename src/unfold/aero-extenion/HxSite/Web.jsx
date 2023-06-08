import {Card, Tree} from "antd";
import "./Cab.norm.scss";
import Ux from "ux";
import __Zn from '../zero.aero.dependency';

const __buildTree = (reference, card) => {
    const {data = {}, config = {}} = reference.props;
    const {webTree = {}, group = {}} = config;
    const dataTree = {};
    Object.keys(data).forEach(field => {
        let dataArray = data[field];
        if (group.root) {
            dataArray = dataArray.concat(Ux.clone(data[group.root]));
        }
        dataArray.forEach(each => {
            if ("string" === typeof each.icon) {
                each.icon = Ux.v4Icon(each.icon)
            }
        })
        dataTree[field] = Ux.toTree(dataArray, webTree);
    });
    const root = card.root;
    const treeData = [];
    root.forEach(rootItem => {
        /*
         * 此处 dataTree 中追加了 root，不需要处理根节点，而是根据根节点查找对应节点
         */
        const children = [];
        Object.keys(dataTree)
            .filter(type => rootItem.value.includes(type))
            .forEach(item => {
                const tree = dataTree[item];
                // 执行 Card 过滤
                const $card = card.data;
                const filtered = tree.filter(item => $card.key === item.key);
                filtered.forEach(item => {
                    if (item.children) {
                        item.children.forEach(child => children.push(child));
                    }
                })
            });
        if (0 < children.length) {
            // 无子项不执行
            const $root = Ux.clone(rootItem);
            $root.checkable = false;
            $root.children = children;
            treeData.push($root);
        }
    })
    return treeData;
}
export default (reference, card) => {
    const {$keySet} = reference.state;
    const treeData = __buildTree(reference, card);
    const height = Ux.toHeight(360);
    const bodyStyle = {
        height: height / 2,
        minHeight: height / 2
    }
    const {$tree = {}} = reference.state;
    return (
        <Card key={card.key} title={card.title} bodyStyle={bodyStyle}>
            <Tree {...$tree}
                  treeData={treeData}
                  checkedKeys={Array.from($keySet)}
                  onCheck={__Zn.aclE.rxCheckFn(reference, treeData)}/>
        </Card>
    )
}