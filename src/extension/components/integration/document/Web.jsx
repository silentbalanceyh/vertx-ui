import React from 'react';
import {Breadcrumb, Col, Divider, Row, Tree} from 'antd';
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
import DocList from './list/Doc';
import TrashList from './list/Trash';
import RdrSeg from './Web.Segment';

const renderToolbar = (reference) => {
    const {
        $directory,
        $page = "DOCUMENT"
    } = reference.state;
    if ("DOCUMENT" === $page) {
        return RdrSeg.renderKitList(reference, $directory);
    } else {
        return RdrSeg.renderKitTrash(reference);
    }
}
const renderNav = (reference) => {
    /*
     * 两个核心配置
     * 1. back 配置（返回上一级菜单）
     * 2. 根节点专用配置（所有文档）
     */
    const {
        $directory,          // 选中的目录 ID，$treeMap 中的 key 值
        $page = "DOCUMENT"
    } = reference.state;
    if ("DOCUMENT" === $page) {
        const action = Ux.fromHoc(reference, "action");
        const {back} = action.nav ? action.nav : {};
        let navigation = [];
        if ($directory) {
            navigation = $directory.navigation ? $directory.navigation : []
        }
        return (
            <Row className={"navigation"}>
                <Col span={3}>
                    {/* */}
                    <a href={""} disabled={2 > navigation.length}
                       onClick={Op.rxNavBack(reference, navigation)}>
                        {Ux.v4Icon("rollback")}
                        &nbsp;
                        {back.text}
                    </a>
                    <Divider type={"vertical"}/>
                </Col>
                <Col span={21}>
                    <Breadcrumb>
                        {navigation.map(nav => (
                            <Breadcrumb.Item key={nav.key}>
                                <a href={""} onClick={Op.rxNavClick(reference, nav)}>
                                    {nav.name}
                                </a>
                            </Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                </Col>
            </Row>
        );
    } else return false;
}
// ----------------- Directory List ----------------------------
const renderList = (reference) => {
    const {
        $directory,
        $page = "DOCUMENT",
        $trash = [],
        $selectedKeys = [],

        $keyword,
        $lazy = {},

        $dataList,
        $dataLoading = false
    } = reference.state;

    const inherit = Ex.yoAmbient(reference);
    inherit.$directory = $directory;
    inherit.$selectedKeys = $selectedKeys;
    inherit.rxRowSelect = Op.List.rxRowSelect(reference);
    if ("DOCUMENT" === $page) {
        inherit.rxNav = Op.List.rxNav(reference);
        inherit.rxMixRename = Op.List.rxMixRename(reference);
        inherit.rxMixTrash = Op.List.rxMixTrash(reference);
        inherit.$spinning = $dataLoading;
        inherit.$highlight = $keyword;
        inherit.$lazy = $lazy;
        inherit.data = $dataList;
        return (<DocList {...inherit}/>)
    } else {
        inherit.data = $trash;
        inherit.rxMixRollback = Op.List.rxMixRollback(reference);
        inherit.rxMixPurge = Op.List.rxMixPurge(reference);
        return (<TrashList {...inherit}/>);
    }
}
// ----------------- Directory Tree ----------------------------

const renderDirTree = (reference) => {
    let {
        $data = [],
        $directory = {},
    } = reference.state;
    /*
     * 1. 根节点为 category
     * 2. 一级子节点开始为 directory
     * 3. 中间连接依靠 category 的 runComponent
     *
     * 所有事件的核心点
     * 1. 展开：category -> runComponent
     * 2. 选中：directory -> runComponent
     * 3. 最终构造的右侧文档来源
     * -- directory中的子目录
     * -- directory中存储的附件
     */
    let selectedKeys = [];
    if ($directory) {
        selectedKeys = [$directory.key];
    } else {
        selectedKeys = [];
    }
    const treeData = Ux.toTree($data, {title: "name", sort: "sort"});
    // treeData 新版处理
    return (
        <Tree.DirectoryTree defaultExpandAll
                            treeData={treeData}
                            selectedKeys={selectedKeys}
                            expandAction={"doubleClick"}
                            onSelect={Op.rxTreeSelect(reference)}/>
    )
}
export default {
    renderDirTree,
    renderDirAction: RdrSeg.renderDirAction,
    renderToolbar,
    renderNav,
    renderList
}