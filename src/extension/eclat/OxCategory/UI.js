import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import {Collapse} from 'antd';
import './Cab.less';
import Op from './Op';

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
            const treeData = Ux.toTree(data, tree);
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
            attrsTree.onSelect = Op.onSelect(this);
            attrsTree.disabled = $disabled;     // 关闭树的选择功能
            return (
                <div>
                    <Collapse defaultActiveKey={defaultActiveKey}
                              className={"ox-collapse"}>
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