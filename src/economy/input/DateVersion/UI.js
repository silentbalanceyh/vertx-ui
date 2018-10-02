import React from 'react';
import './Cab.less';
import {Input} from 'antd';
import Ux from 'ux';
import Op from './Op';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Ux.xtInit(props);
    }

    UNSAFE_componentWillReceiveProps(nextProps, context) {
        Ux.xtUnsafe(this, nextProps);
    }

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
        )
    }
}

export default Component