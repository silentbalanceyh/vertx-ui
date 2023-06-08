import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import {Collapse} from "antd";

const UCA_NAME = "ExArbor";
const {Panel} = Collapse;

/**
 * ## 「组件」`ExArbor`
 *
 * ```js
 * import { ExArbor } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|x|x|
 *
 * #### 1.1. 布局
 *
 * ```shell
 * | Collapse -------|
 * |  Menu           |
 * |    |-- Menu     |
 * |    |-- Menu     |
 * |                 |
 * | Collapse -------|
 * | Collapse -------|
 * |  Menu           |
 * |    |-- Menu     |
 * |                 |
 * | Collapse -------|
 * |  Menu           |
 * |    |-- Menu     |
 * |    |-- Menu     |
 * |                 |
 * |-----------------|
 * ```
 *
 * @memberOf module:uca/extension
 * @method ExArbor
 *
 */
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    state = {
        $ready: true
    };

    render() {
        return Ex.yoRender(this, () => {
            const {data = [], config = {}, fnSelect} = this.props;
            const treeData = Ux.toTree(data, config);
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
            if (Ux.isFunction(fnSelect)) {
                attrsTree.onSelect = fnSelect;
            }
            return (
                <Collapse defaultActiveKey={defaultActiveKey} className={"ux_collapse"}>
                    {treeData.map(item => (
                        <Panel key={item.key} header={item.text}
                               showArrow={false}>
                            {Ux.aiTree(item.children, attrsTree)}
                        </Panel>
                    ))}
                </Collapse>
            );
        }, Ex.parserOfColor(UCA_NAME).component())
    }
}

export default Component;