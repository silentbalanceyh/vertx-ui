import Ux from 'ux';
import {Input, Tabs} from "antd";
import React from "react";

export default (reference, config = {}) => (...UIS) => {
    const {name} = config;
    const attrs = Ux.valueLimit(reference.props);
    return Ux.xtReady(reference, () => {
        const {$tabs = {}, $form} = reference.state;
        const {value} = reference.props;
        // 子属性
        const childAttrs = {};
        childAttrs.config = $form;
        /* 上层 onChange 函数 */
        childAttrs.onChange = values => {
            // Ux.xtChange(reference, values);
        };
        childAttrs.value = value;
        const {items = [], ...rest} = $tabs;
        return (
            <Input.Group {...attrs}>
                <div className={"ex-input-complex"}>
                    {/* 必须设置 value 使得 ExTab 可控 */}
                    <Tabs {...rest}>
                        {items.map((item, index) => (
                            <Tabs.TabPane {...item}>
                                {(() => {
                                    const UI = UIS[index];
                                    return (<UI {...childAttrs} key={`component${index}`}/>)
                                })()}
                            </Tabs.TabPane>
                        ))}
                    </Tabs>
                </div>
            </Input.Group>
        )
    }, {name, logger: true})
}