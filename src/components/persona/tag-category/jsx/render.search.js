import {Button, Col, Icon, Input, Row, Tree} from "antd";
import React from "react";
import Ux from 'ux';
import Evt from '../event';

const TreeNode = Tree.TreeNode;
const jsxContent = (item = {}, reference, attrs = {}) => {
    if ("ADD" === item.text) {
        const tree = Ux.fromHoc(reference, "tree");
        const {action = {}} = tree;
        // link
        const linkAttrs = {};
        linkAttrs.disabled = attrs.disabled;
        if (!linkAttrs.disabled) {
            linkAttrs.onClick = Evt.rxAdd(reference, item);
        }
        attrs.title = (
            <div className={`ops-node ${attrs.disabled ? "ops-node-disabled" : ""}`}>
                <a href={""} {...linkAttrs}>
                    <Icon type={"plus"} style={{fontSize: 14}}/>
                    &nbsp;
                    {action.add}
                </a>
            </div>
        )
        attrs.selectable = false;
    } else if ("EDIT" === item.text) {
        const {$editionText, $submitting} = reference.state;
        attrs.title = (
            <div className={"ops-node-action"}>
                <Row>
                    <Col span={16}>
                        <Input value={$editionText} onChange={Evt.rxAddChange(reference)}/>
                    </Col>
                    <Col span={8} style={{textAlign: "center"}}>
                        <Button.Group>
                            <Button icon={"check"} size={"small"} type={"primary"}
                                    loading={$submitting} onClick={Evt.rxAddYes(reference)}/>
                            <Button icon={"close"} size={"small"}
                                    loading={$submitting} onClick={Evt.rxAddNo(reference)}/>
                        </Button.Group>
                    </Col>
                </Row>
            </div>
        )
    } else {
        attrs.title = (
            <div className={`ops-node`}>
                {item.text}
                <span className={"action"}>
                    <Button.Group>
                        <Button icon={"plus-circle"} size={"small"} type={"primary"}
                                onClick={Evt.rxSubAdd(reference, item)}/>
                        <Button icon={"edit"} size={"small"} type={"primary"}
                                onClick={Evt.rxSubEdit(reference, item)}/>
                            <Button icon={"close"} size={"small"} type={"primary"}
                                    onClick={Evt.rxSubDel(reference, item)}/>
                    </Button.Group>
                </span>
            </div>
        );
    }
}
const jsxTreeNode = (item = {}, reference) => {
    /*
     * 数据整合处理
     */
    const attrs = {};
    const {$isEdit} = reference.state;
    attrs.disabled = !!$isEdit;
    attrs.key = item.key;
    attrs.data = Ux.clone(item.data);
    /*
     * jsContent
     */
    jsxContent(item, reference, attrs);

    if (item.children && 0 < item.children.length) {
        return (
            <TreeNode {...attrs}>
                {item.children.map(each => jsxTreeNode(each, reference))}
            </TreeNode>
        )
    } else {
        return (<TreeNode {...attrs}/>)
    }
}

const appendNode = ($treeArray = [], reference) => {
    const $treeDone = Ux.clone($treeArray);
    const {$edition = {}, $isEdit} = reference.state;
    if ($isEdit) {
        /*
         * 如果 $treeArray 中不包含 $edition，直接 push
         */
        const found = Ux.elementUnique($treeDone, 'id', $edition.id);
        if (found) {
            found.name = "EDIT";
        } else {
            $treeDone.push($edition);
        }
    }
    /*
     * 末尾信息
     */
    const groupSet = new Set();
    $treeArray.map(item => item.parentId)
        .filter(parentId => undefined !== parentId)
        .forEach(item => groupSet.add(item));
    groupSet.forEach(parentId => {
        const item = {};
        item.id = `op${parentId}`;
        item.parentId = parentId;
        item.name = "ADD";
        $treeDone.push(item);
    })
    $treeDone.push({
        id: "opRoot",
        name: "ADD"
    })
    return $treeDone;
}

export default (reference) => {
    const {$treeArray = []} = reference.state;
    const $treeDone = appendNode($treeArray, reference);       // 追加添加操作
    const $treeData = Ux.toTree($treeDone, {
        text: "name", title: "name",
        key: "id", parent: "parentId"
    });
    const search = Ux.fromHoc(reference, "search");
    const {
        $selectedKeys = []
    } = reference.state;
    return (
        <div className={"tree"} style={{
            height: Ux.toHeight(106)
        }}>
            <div className={"ops-search"}>
                <Input.Search {...search}/>
            </div>
            <Tree className={"tree"} defaultExpandAll showLine
                  selectedKeys={$selectedKeys}
                  onSelect={Evt.rxSelect(reference)}>
                {$treeData.map(each => jsxTreeNode(each, reference))}
            </Tree>
        </div>
    )
}