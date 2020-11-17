import Ux from "ux";
import {Button, Card, Checkbox, Col, Icon, Tooltip} from "antd";
import React from "react";
import Ex from "ex";

import UiExport from "./form/Web.Export";
import UiImport from "./form/Web.Import";
import UiPage from './UI.Page';
import Op from './op';

const renderIcon = (reference, item, iconMap) => {
    const foundKey = Object.keys(iconMap)
        .filter(each => (0 <= item.code.indexOf(each)));
    if (0 < foundKey.length) {
        return (<Icon {...iconMap[foundKey[0]]}/>)
    } else {
        return (<Icon {...iconMap.common}/>)
    }

}

export default {
    renderOp: (reference, action = {}) => {
        const {text, tooltip, ...rest} = action;
        const {$op = {}} = reference.state;
        const executor = $op[rest.key];
        if (Ux.isFunction(executor)) {
            rest.onClick = executor;
        }
        const {$role} = reference.state;
        rest.disabled = undefined === $role;
        return text ? (
            <Button {...rest}>
                {text}
            </Button>
        ) : (
            <Tooltip key={rest.key} title={tooltip}>
                <Button {...rest}/>
            </Tooltip>
        )
    },
    renderPage: (reference) => (items = [], config = {}) => {
        const inherit = Ex.yoAmbient(reference);
        const data = {};
        data.items = items;

        inherit.config = config;

        const {$role, $heightStyle = {}} = reference.state;
        data.entity = $role;
        inherit.data = data;            // 数据本身

        inherit.$heightStyle = $heightStyle;

        Op.yoPSelected(reference, inherit, {
            data, config
        });

        return (<UiPage {...inherit}
                        rxCheck={Op.rxPageChecked(reference)}
                        rxSelect={Op.rxPageSelect(reference)}/>)
    },
    renderChild: (reference) => () => {
        const {$inited = {}} = reference.state;
        if ("EXPORT" === $inited.type) {
            return (
                <UiExport {...Ex.yoAmbient(reference)}/>
            )
        } else {
            return (
                <UiImport {...Ex.yoAmbient(reference)}/>
            )
        }
    },
    renderCard: (reference, iconMap = {}) => (item = {}) => {
        const {$keyPerm = new Set()} = reference.props;
        const enabled = $keyPerm.has(item.key);
        return (
            <Col span={12} className={`data-card ${enabled ? "active" : "inactive"}`}>
                <Card title={(() => {
                    if (enabled) {
                        return (
                            <span>
                                <Icon type={"eye"} style={{color: "#FFB90F", fontSize: 18}}/>
                                &nbsp;&nbsp;
                                {item.name}
                            </span>
                        )
                    } else {
                        return (
                            <span>
                                <Icon type={"eye-invisible"} style={{color: "red", fontSize: 18}}/>
                                &nbsp;&nbsp;
                                {item.name}
                            </span>
                        )
                    }
                })()} extra={
                    <Checkbox checked={enabled}
                              onChange={Op.rxPermCheck(reference, item)}/>
                }>
                    <Card.Meta title={item.code}
                               description={item.comment}
                               avatar={renderIcon(reference, item, iconMap)}/>
                </Card>
            </Col>
        )
    }
}