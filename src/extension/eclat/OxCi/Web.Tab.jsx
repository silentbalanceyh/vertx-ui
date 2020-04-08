import {Tabs} from "antd";
import U from "underscore";
import React from "react";
import Ex from "ex";
import {LoadingAlert} from "web";

export default (reference) => {
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
                        {U.isFunction(fnRender) ? fnRender(inherit) : false}
                    </Tabs.TabPane>
                )
            })}
        </Tabs>
    );
}