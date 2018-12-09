import React from 'react';
import 'braft-editor/dist/index.css';
import './Cab.less';
import BraftEditor from 'braft-editor';
import Op from './Op';
import {Input} from 'antd';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = Op.initState(this.props);
    }

    componentDidUpdate(prevProps) {
        // 强制更新
        Op.updateState(this);
    }

    render() {
        const {config = {}, content} = this.state;
        return (
            <Input.Group className={"web-braft-editor"}>
                <BraftEditor {...config}
                             value={content}
                             onChange={Op.on2Change(this)}/>
            </Input.Group>
        );
    }
}

export default Component;