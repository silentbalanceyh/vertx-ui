import React from 'react';
import './Cab.less';
import {Input} from 'antd';
import Ux from 'ux';
import Rdr from './UI.Render';

class Component extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = Ux.xtInit(props);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        Ux.xtUnsafe(this, nextProps);
    }

    render() {
        return (
            <Input.Group>
                {Rdr.renderTitle(this)}
                {Rdr.renderBody(this)}
            </Input.Group>
        );
    }
}


export default Component;