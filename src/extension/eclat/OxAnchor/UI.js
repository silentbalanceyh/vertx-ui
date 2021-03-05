import React from 'react';
import Ux from "ux";
import {Icon} from "antd";
import Ex from "ex";
import Yi from './yi';
import Event from './event';
import renderJsx from './Web.Render';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExAnchor")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Yi.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {data = {}} = this.props;
            return (
                <span>
                    {/* eslint-disable-next-line */}
                    <a href={"#"} onClick={Event.onClick(this)}>
                        {data.code}&nbsp;&nbsp;<Icon type={"search"}/>
                    </a>
                    {renderJsx(this)}
                </span>
            );
        }, Ex.parserOfColor("OxAnchor").component())
    }
}

export default Component;