import React from 'react';
import {Input, TreeSelect} from 'antd';

class Component extends React.PureComponent {
    render() {
        return (
            <Input.Group>
                <TreeSelect/>
            </Input.Group>
        );
    }
}

export default Component;