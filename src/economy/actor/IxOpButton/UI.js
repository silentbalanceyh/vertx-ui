import React from 'react';
import {Button} from 'antd';

class Component extends React.PureComponent {
    render() {
        const {$config = {}} = this.props;
        const {text, ...rest} = $config;
        return (
            <span>
                <Button {...rest} htmlType={"button"}/>
            </span>
        );
    }
}

export default Component;