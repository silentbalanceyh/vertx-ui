import React from 'react';
import {Cascader, Input} from 'antd';
import Op from './Op';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        Op.yiInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yiUpdate(this, prevProps);
    }

    render() {
        const {options = [], defaultValue} = this.state;
        const {placeholder} = this.props;
        const attrs = {};
        if (placeholder) attrs.placeholder = placeholder;
        // 设置默认值
        if (defaultValue) {
            attrs.value = defaultValue;
        }
        attrs.options = options;
        return (
            <Input.Group>
                <Cascader {...attrs}
                          loadData={Op.yoData(this)}
                          onChange={Op.onChange(this)}
                          style={{minWidth: 280}}/>
            </Input.Group>
        );
    }
}

export default Component;