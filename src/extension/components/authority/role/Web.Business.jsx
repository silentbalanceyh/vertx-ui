import {Row, Tree} from 'antd';
import React from "react";
import Ux from 'ux';
import Op from './op';
/*
 * 业务权限选择
 */
export default (reference) => {
    const {
        $source,
        $heightStyle = {},
        $role,
        $treeBusiness = {}
    } = reference.state;
    const data = $source.business ? $source.business : [];
    const $style = Ux.clone($heightStyle);
    if ($style.style) {
        // 左侧修正值
        $style.style.maxHeight = $style.style.maxHeight + 80;
    }
    const checkedKeys = Op.yoChoice(reference, data);
    /*
     * 当前树中组信息
     */
    return (
        <Row className={"op-system"}>
            <div className={"card"}>
                <Tree checkedKeys={checkedKeys}
                      disabled={!$role}
                      {...$treeBusiness}
                      {...$style} className={"card-content"}/>
            </div>
        </Row>
    )
}