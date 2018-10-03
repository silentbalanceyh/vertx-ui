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

    // Required：更新数据，主要用于form中的Reset动作
    componentDidUpdate(prevProps) {
        Ux.xtReset(this, Op.getDefault());
    }

    // Required：绑定更新数据专用
    // componentWillReceiveProps
    UNSAFE_componentWillReceiveProps(nextProps, context) {
        Ux.xtUnsafe(this, nextProps);
    }

    // 核心方法，渲染组件
    render() {
        const {config = {}} = this.props;
        return (
            <Input.Group className={"web-date-version"}
                         compact>
                <Input {...Op.getAttrs(this, "year")}/>
                <Input {...Op.getAttrs(this, "month")}/>
                <Input {...Op.getAttrs(this, "day")}/>
                {config.version ? <Input {...Op.getAttrs(this, "version")}/> : false}
            </Input.Group>
        );
    }
}

export default Component;