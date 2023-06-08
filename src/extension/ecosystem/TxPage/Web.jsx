import React from 'react';
import Ux from "ux";
import {Button} from "antd";


const renderTitle = (reference, $workflow = {}) => {
    const {$showTask = false} = reference.props;
    const {$taskActive} = reference.state;
    return (
        <span className={"tx-page-title"}>
            {$workflow.name}
            &nbsp;&nbsp;{$showTask ? "/" : false}&nbsp;&nbsp;
            {$showTask ? (
                <span className={"task-name"}>
                    {$taskActive}
                </span>
            ) : false}
        </span>
    )
}
const renderBack = (reference) => {
    const target = Ux.toQuery("target");
    if (target) {
        return (
            <Button className={"uc_pink"} icon={Ux.v4Icon("double-left")}
                    onClick={event => {
                        Ux.prevent(event);
                        Ux.toOriginal(reference, null, ["tid"]);
                    }}
            />
        );
    } else return false;
}
const renderExtra = (reference, $workflow = {}) => {
    let catalog = Ux.elementUniqueDatum(reference, "service.catalog", 'code', $workflow.code);
    // 解决页面白屏
    if (!catalog) {
        catalog = {};
    }
    const attrs = {};
    attrs.className = "tx-catalog";
    if (catalog) {
        const {metadata = {}} = catalog;
        attrs.style = metadata.item ? metadata.item : {};
    } else {
        attrs.style = {};
    }
    const info = Ux.fromHoc(reference, "info");
    return (
        <span className={"tx-page-extra"}>
            <span {...attrs}>
                <span className={"tx-prefix"}>
                    {info['catalog']}
                    ：
                </span>
                {catalog.name}
            </span>
            {renderBack(reference)}
        </span>
    )
}
export default {
    /*
     * 渲染标题
     * 流程名称 -> 任务名称
     */
    renderTitle,
    renderExtra,
}