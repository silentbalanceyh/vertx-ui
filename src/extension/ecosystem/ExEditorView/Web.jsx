import {Checkbox, Col, Popconfirm, Radio, Row} from "antd";
import React from "react";
import Ux from 'ux';
import Op from './Op';
import {Link} from "react-router-dom";

const renderItem = (reference) => (item) => {
    const {$myDefault = {}} = reference.props;
    let title = item.title;
    if (!title && $myDefault.name === item.name) {
        title = $myDefault.title;
    }
    const {
        $combine = {}, $selectedKeys = [],
        $selectedKey
    } = reference.state;
    const {toolbar = {}} = $combine;
    const itemAttr = {};
    if (Op.isEdit(reference)) {
        itemAttr.onDoubleClick = Op.rxOpen(reference, item);
    } else {
        itemAttr.onClick = Op.rxRadio(reference, item);
    }
    // Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VR35
    const isView = Op.isView(reference);
    if (isView) {
        // 非编辑视图
        // Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VR3I
        return (
            <Row className={"v-list-item"} {...itemAttr}>
                <Col span={2}>
                    <Radio name={"rdoView"} checked={$selectedKey === item.name}
                           onChange={Op.rxRadio(reference, item)}/>
                </Col>
                <Col span={10}>
                    {title}
                </Col>
                <Col span={12}>
                    {item.name}
                </Col>
            </Row>
        );
    } else {
        // 编辑视图
        return (
            <Row className={"v-list-item"} {...itemAttr}>
                <Col span={2}>
                    {"DEFAULT" !== item.name ? (
                        <Checkbox onChange={Op.rxChecked(reference, item)}
                                  checked={$selectedKeys.includes(item.key)}/>
                    ) : false}
                </Col>
                <Col span={10}>
                    {title}
                </Col>
                <Col span={12} className={"v-list-right"}>
                    {(() => {
                        const {edit = {}} = toolbar;
                        return (
                            <Link onClick={Op.rxOpen(reference, item)} to={""}>
                                {Ux.v4Icon(edit.icon)}
                                &nbsp;{edit.text}
                            </Link>
                        )
                    })()}
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    {(() => {
                        const {remove = {}} = toolbar;
                        return "DEFAULT" !== item.name ? (
                            <Popconfirm title={remove.confirm}
                                        onConfirm={Op.rxDelete(reference, item, remove)}>
                                <Link to={""} onClick={event => Ux.prevent(event)}>
                                    {Ux.v4Icon(remove.icon)}
                                    &nbsp;{remove.text}
                                </Link>
                            </Popconfirm>
                        ) : false;
                    })()}
                </Col>
            </Row>
        );
    }
}
const renderHeader = (reference, header) => {
    return (
        <div className={"checked-all"}>
            {header}
        </div>
    )
}
export default {
    // List中的Item渲染
    renderItem,
    renderHeader,
}