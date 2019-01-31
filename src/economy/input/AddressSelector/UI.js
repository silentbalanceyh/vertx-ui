import React from 'react';
import {Cascader, Input} from 'antd';
import Op from './Op';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        Op.initOptions(this);
    }

    render() {
        const {options = []} = this.state;
        const {placeholder} = this.props;
        const attrs = {};
        if (placeholder) attrs.placeholder = placeholder;
        return (
            <Input.Group>
                <Cascader options={options} {...attrs} loadData={Op.loadData(this)}
                          style={{minWidth: 280}}/>
            </Input.Group>
        );
    }
}

export default Component;