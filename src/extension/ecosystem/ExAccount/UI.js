import React from 'react';
import Ux from "ux";
import Op from './Op';
import Ex from 'ex';
import './Cab.less';
import {Icon} from "antd";

const LOG = {
    name: "ExAccount",
    color: "#3CB371"
};

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("ExAccount")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiAccount(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$data = {}} = this.state;
            const {alias, icon, name, items = []} = $data;
            return (
                <div className={"ex-account"}>
                    <div className={"avatar-holder"}>
                        {Ux.aiIcon(icon)}
                        <div className={"name"}>{name}</div>
                        <div>{alias}</div>
                    </div>
                    <div className={"detail"}>
                        {items.map(item => (
                            <p key={Ux.randomUUID()}>
                                <Icon type={item.icon}/>
                                &nbsp;&nbsp;
                                {item.value}
                            </p>
                        ))}
                    </div>
                </div>
            )
        }, LOG)
    }
}

export default Component;