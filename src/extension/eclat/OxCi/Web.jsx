import {Breadcrumb, Tabs} from "antd";
import Op from "./Op";
import React from "react";
import Ex from "ex";
import {LoadingAlert} from "web";
import Ux from 'ux';

export default {
    renderNav: (reference) => {
        const {$stack = [], $index} = reference.state;
        return (
            <Breadcrumb separator={">"}>
                {$stack.map(item => {
                    let className;
                    if ($index === item.index) {
                        className = "nav-item nav-active"
                    } else {
                        className = "nav-item"
                    }
                    return (
                        <Breadcrumb.Item key={item.key} className={className}>
                            {/* eslint-disable-next-line */}
                            <a href={"#"} onClick={Op.onSelected(reference, item)}>{item.name}</a>
                        </Breadcrumb.Item>
                    )
                })}
            </Breadcrumb>
        )
    },
    renderPage: (reference) => {
        const inherit = Ex.yoAmbient(reference);
        const {$tabs = {}, failure} = reference.state;
        const {items = [], ...rest} = $tabs;
        return failure ? (
            <div style={{
                paddingTop: "10%",
                paddingLeft: "20%",
                paddingRight: "20%"
            }}>
                <LoadingAlert $alert={{
                    message: "Error",
                    description: [
                        failure
                    ]
                }} $icon={"stop"} $type={"error"}/>
            </div>
        ) : (
            <Tabs {...rest}>
                {items.map(item => {
                    const {fnRender, ...itemRest} = item;
                    return (
                        <Tabs.TabPane {...itemRest}>
                            {Ux.isFunction(fnRender) ? fnRender(inherit) : false}
                        </Tabs.TabPane>
                    )
                })}
            </Tabs>
        );
    }
}