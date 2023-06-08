import Ux from "ux";
import Op from "./Op";
import React from "react";
import {Button, Col, Input, Row} from "antd";
import RdrForm from "./form/Web";

const renderDirAction = (reference) => {
    const action = Ux.fromHoc(reference, "action");
    const {trash, clean} = action['card'] ? action['card'] : {};
    const {
        $trash = [],
        $page = "DOCUMENT",
    } = reference.state;
    const toolbar = Op.rxToolbar(reference);
    // 左边Action
    const actionTrash = {};
    if (0 < $trash.length) {
        actionTrash.onClick = toolbar.trash;
        actionTrash.className = "card-action";
    } else {
        actionTrash.className = "card-action card-action-disabled";
    }
    // 右边Action
    const actionClean = {};
    if (0 < $trash.length && "DOCUMENT" !== $page) {
        actionClean.onClick = toolbar.purge
        actionClean.className = "card-action";
    } else {
        actionClean.className = "card-action card-action-disabled";
    }
    return [
        <span {...actionTrash}>
            <img src={Ux.Env.ICON_SYS.TRASH_FOLDER} alt={"Trash"}/>
            <label>{trash}({$trash.length})</label>
        </span>,
        <span {...actionClean}>
            <img src={Ux.Env.ICON_SYS.CLEAN} alt={"Clean"}/>
            <label>{clean}</label>
        </span>
    ]
}

const renderKeyword = (reference) => {
    const info = Ux.fromHoc(reference, "info");
    const {
        $keyword
    } = reference.state;
    if ($keyword) {
        const {keyword = {}} = info;
        const message = Ux.formatExpr(keyword.success, {keyword: $keyword})
        return (
            <span className={"keyword"}>
                {message}
            </span>
        )
    } else return false;
}
const renderKitList = (reference, $directory) => {
    const action = Ux.fromHoc(reference, "action");
    const {button = [], search = {}} = action;
    const toolbar = Op.rxToolbar(reference);
    return (
        <Row>
            {RdrForm.renderDirAdd(reference)}
            <Col span={16} className={"button"}>
                {button.map(each => {
                    const {text, permission = [], ...rest} = each;
                    const attrs = Ux.clone(rest);
                    if ($directory) {
                        const {visitMode = []} = $directory;
                        attrs.disabled = !Ux.elementInAny(visitMode, permission);
                    } else {
                        attrs.disabled = true;
                    }
                    if (Ux.isFunction(toolbar[attrs.key])) {
                        attrs.onClick = toolbar[attrs.key]
                    }
                    if (permission.includes("s") && !attrs.disabled) {
                        const {$selectedKeys = []} = reference.state;
                        attrs.disabled = 0 === $selectedKeys.length;
                    }
                    // v4
                    if (attrs.icon) {
                        attrs.icon = Ux.v4Icon(attrs.icon);
                    }
                    return (
                        <Button {...attrs}>{text}</Button>
                    )
                })}
                {renderKeyword(reference)}
            </Col>
            <Col span={7} className={"search"}>
                <Input.Search {...search} allowClear
                              disabled={!$directory}
                              onSearch={Op.rxInputSearch(reference)}/>
            </Col>
        </Row>
    )
}
const renderKitTrash = (reference) => {
    const action = Ux.fromHoc(reference, "action");
    const {trash = []} = action;
    const toolbar = Op.rxToolbar(reference);
    const {$selectedKeys = []} = reference.state;
    return (
        <Row className={"tool-trash"}>
            <Col span={16} className={"button"}>
                {trash.map(each => {
                    const {text, confirm, permission = [], ...rest} = each;
                    // 是否禁用
                    const disabled = 0 === $selectedKeys.length;
                    if (disabled) {
                        const attrs = Ux.clone(rest);
                        attrs.disabled = true;
                        return (
                            <Button {...attrs}>{text}</Button>
                        )
                    } else {
                        const attrs = Ux.clone(rest);
                        if (Ux.isFunction(toolbar[attrs.key])) {
                            attrs.onClick = toolbar[attrs.key]
                        }
                        return (
                            <Button {...attrs}>{text}</Button>
                        )
                    }
                })}
            </Col>
        </Row>
    );
}
export default {
    renderDirAction,
    renderKitList,
    renderKitTrash,
}