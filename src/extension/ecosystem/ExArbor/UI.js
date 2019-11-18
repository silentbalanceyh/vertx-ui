import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import U from 'underscore';
import {Collapse} from "antd";

const {Panel} = Collapse;

class Component extends React.PureComponent {
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
            if (U.isFunction(fnSelect)) {
                attrsTree.onSelect = fnSelect;
            }
            return (
                <Collapse defaultActiveKey={defaultActiveKey} className={"ox-collapse"}>
                    {treeData.map(item => (
                        <Panel key={item.key} header={item.text}
                               showArrow={false}>
                            {Ux.aiTree(item.children, attrsTree)}
                        </Panel>
                    ))}
                </Collapse>
            );
        }, Ex.parserOfColor("ExArbor").component())
    }
}

export default Component;