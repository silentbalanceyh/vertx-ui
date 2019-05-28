import React from 'react';
import {Spin} from "antd";
import './Cab.less';

class Component extends React.PureComponent {
    render() {
        const height = document.body.clientHeight;
        const header = height / 4;
        const style = {
            marginTop: header + "px",
            height: "360px"
        };
        return (
            <div style={style} className={"ex-content"}>
                <Spin size="large"/>
            </div>
        );
    }
}

export default Component;