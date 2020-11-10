import React from 'react';
import Op from "./Op";
import Ux from 'ux';
import {Input, Spin, Tree} from "antd";
import {Dialog} from "web";

class Component extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = Op.yiDefault(this);
    }

    componentDidMount() {
        Ux.xtLazyInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Ux.xtLazyUp(this, {props: prevProps, state: prevState});
    }

    render() {
        const {config = {}, ...jsx} = this.props;
        const {
            onClick, dialog,
            $data = [], tree = {},
            $loading = false,
        } = this.state ? this.state : {};
        jsx.onClick = onClick;
        const inputAttrs = Op.yiValue(this, jsx);
        const treeData = Ux.toTree($data, config.tree);

        /*
         * selectable
         */
        Op.yoTreeData(this, treeData);
        /*
         * 根据
         * tree
         * treeData
         */
        const treeAttrs = Op.yoTree(this, tree, treeData);

        /*
         * 处理输入框属性
         */
        const inputCombine = Op.yoCombine(this, inputAttrs);
        return (
            <div>
                <Input {...inputCombine}/>
                <Dialog className="web-dialog"
                        size={"small"}
                        $visible={this.state['$visible']}   // 窗口是否开启
                        $dialog={dialog}>
                    <Spin spinning={$loading}>
                        <div style={{
                            overflow: "auto",
                            minHeight: 300,
                            maxHeight: 450
                        }}>
                            <Tree {...treeAttrs}/>
                        </div>
                    </Spin>
                </Dialog>
            </div>
        );
    }
}

export default Component;