import React from 'react';
import Op from './Op';
import {Button, Input} from 'antd';
import IxDrawer from '../IxDrawer/UI';

class Component extends React.PureComponent {
    state = {
        search: undefined,  // undefined 禁用
        cond: [],
        advanced: undefined, // undefined 禁用
        visible: false,
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        const {search, advanced, visible = false} = this.state;
        return search ? (
            <span>
                <Input.Search {...search}/>
                &nbsp;&nbsp;
                <Button.Group>
                    <Button icon={"redo"} htmlType={"button"} onClick={Op.onClear(this)}/>
                    {advanced ? (
                        <Button icon={"filter"} htmlType={"button"}
                                onClick={Op.onOpen(this)}/>
                    ) : false}
                </Button.Group>
                {advanced ? (
                    <IxDrawer $visible={visible} $config={advanced}/>
                ) : false}
            </span>
        ) : false;
    }
}

export default Component;