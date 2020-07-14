import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import {ExListComplex} from "ei";
import Op from './Op';
import jsx from "./Web.Tree";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI.Res.List")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiResPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            return Ux.aiGridLR(this,
                () => {
                    const {$tree = []} = this.props;
                    return jsx.treeResource(this, $tree);
                },
                () => {
                    const listAttrs = Op.yoResList(this);
                    return (<ExListComplex {...listAttrs}/>)
                },
                {
                    rowCls: "web-authority-resource",
                    rightCls: "content"
                })
        }, Ex.parserOfColor("PxResourceList").control());
    }
}

export default Component