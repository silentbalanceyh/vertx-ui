import React from 'react';
import Op from './Op';
import Ux from "ux";
import Ex from "ex";
import {Button} from "antd";
import renderJsx from './Web';
import renderNav from './Web.Nav';
import './Cab.less';

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.ylCard(this,
            () => {
                return (
                    <div className={"web-authority-view"}>
                        {renderNav(this)}
                        {renderJsx(this)}
                    </div>
                )
            },
            Ex.parserOfColor("PxAuthority-View").page({
                extra: ((reference) => {
                    return (
                        <Button shape={"circle"} className={"ux-red"}
                                icon={"close"}
                                onClick={event => {
                                    Ux.prevent(event);
                                    Ux.toRoute(reference, `/authority/role`, {target: "/rbac/permission"});
                                }}
                        />
                    )
                })(this)
            }))
    }
}

export default Component