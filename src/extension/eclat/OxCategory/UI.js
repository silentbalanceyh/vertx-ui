import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import {Collapse} from 'antd';

import {Dsl} from "entity";
import Sk from 'skin';
import "./Cab.norm.scss";

/**
 * ## 「组件」`OxCategory`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * @memberOf module:uca/extension
 * @method OxCategory
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const onSelect = (reference) => (input = []) => {
    const {data = [], config = {}} = reference.props;
    /*
     * Here must exist the value for processing
     */
    if (0 < input.length) {
        const {ui: {tree}} = config;
        const $data = Ux.toTreeArray(data, tree);
        const dataEvent = Dsl.getEvent($data)     // 设置 source
            .start(input)       // 设置 input
            .config(config);    // 设置 config
        const {onSelect} = reference.state;
        // 必须
        Ux.activeSearch();
        if (Ux.isFunction(onSelect)) {
            onSelect(dataEvent)
        } else {
            console.warn("[ Ox ] onSelect 函数未传入", onSelect);
        }
    }
}
const configuration = {
    ...Ex.parserOfColor("OxCategory").component(),
    type: "Control"
};
const {Panel} = Collapse;

@Ex.ox(configuration)
class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    render() {
        return Ex.yoRender(this, () => {
            const {config: {ui = {}}, data = []} = this.props;
            const {$disabled = false} = this.state;
            const {tree} = ui;
            let treeData = Ux.toTree(data, tree);
            /*
             * 1）顶层是 Collapse Panel
             * 2）从第二层开始是 Menu
             * 3）默认展开第一个
             */
            const defaultActiveKey = treeData
                .filter((item, index) => 0 === index)
                .map(item => item.key);
            /*
             * Tree专用属性
             */
            const attrsTree = {};
            attrsTree.onSelect = onSelect(this);
            attrsTree.disabled = $disabled;     // 关闭树的选择功能

            const attrsCat = Sk.mixOx("OxCategory");
            return (
                <div {...attrsCat}>
                    <Collapse defaultActiveKey={defaultActiveKey}>
                        {treeData.map(item => (
                            <Panel key={item.key} header={item.text}
                                   showArrow={false}>
                                {Ux.aiTree(item.children, attrsTree)}
                            </Panel>
                        ))}
                    </Collapse>
                    {Ux.anchorTree(this)}
                </div>
            );
        }, configuration)
    }
}

export default Component;