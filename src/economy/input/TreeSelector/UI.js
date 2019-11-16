import React from 'react';
import Op from "./Op";
import Ux from 'ux';
import {Icon, Input, Tree} from "antd";
import {Dialog} from "web";

class Component extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = Op.yiDefault(this);
    }

    componentDidMount() {
        Op.yiInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yiUpdate(this, prevProps);
    }

    render() {
        const {config = {}, ...jsx} = this.props;
        const {onClick, dialog, $data = [], tree = {}} = this.state ? this.state : {};
        jsx.onClick = onClick;
        const inputAttrs = Op.yiValue(this, jsx);
        /*
         * treeData
         */
        const treeData = Ux.toTree($data, config.tree);
        const treeAttrs = Ux.clone(tree);
        treeAttrs.treeData = treeData;
        return (
            <div>
                <Input className="ux-readonly"
                       readOnly {...inputAttrs}
                       suffix={<Icon type="search" onClick={onClick}/>}/>
                <Dialog className="web-dialog"
                        size={"small"}
                        $visible={this.state.$visible}   // 窗口是否开启
                        $dialog={dialog}>
                    <div style={{
                        overflow: "auto",
                        maxHeight: 550
                    }}>
                        <Tree {...treeAttrs}/>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default Component;