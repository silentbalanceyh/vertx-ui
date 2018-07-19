import React from 'react';
import './Cab.less';
import {Divider, Icon} from 'antd';

class Component extends React.Component {
    render() {
        return (
            <div className="web-layout-bar">
                <Icon type={"save"}/>
                <Icon type={"copy"}/>
                <Icon type={"delete"} style={{color: "#ff686b"}}/>
                <Icon type={"export"}/>
                <Divider type="vertical"/>
                <Icon type={"question-circle-o"} style={{color: "#1464b4"}}/>
                <Icon type={"solution"}/>
            </div>
        );
    }
}

export default Component
