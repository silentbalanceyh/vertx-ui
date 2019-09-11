import React from 'react';
import './Cab.less';
import {Input} from 'antd';
import Ux from 'ux';
import Op from './Op';

class Component extends React.PureComponent {
    // Required：构造函数必须，要设置state的默认格式
    constructor(props) {
        super(props);
        this.state = Ux.xtInit(props);
    }

    // 核心方法，渲染组件
    render() {
        const {config = {}} = this.props;
        return (
            <Input.Group className={"web-date-version"}
                         compact>
                <Input {...Op.getAttrs(this, "year")} className={"input-left"}/>
                <Input {...Op.getAttrs(this, "month")} className={"input-left"}/>
                <Input {...Op.getAttrs(this, "day")} className={"input-left"}/>
                {config.version ? <Input {...Op.getAttrs(this, "version")}/> : false}
            </Input.Group>
        );
    }
}

export default Component;