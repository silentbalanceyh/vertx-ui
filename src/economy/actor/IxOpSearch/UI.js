import React from 'react';
import Op from './Op';
import {Button, Input} from 'antd';
import IxDrawer from '../IxDrawer/UI';
import Ux from "ux";

class Component extends React.PureComponent {
    state = {
        search: undefined,  // undefined 禁用
        advanced: undefined, // undefined 禁用
        cond: [],
        visible: false,
        searchText: ""
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        const {search, advanced, visible = false, searchText = ""} = this.state;
        const {FormFilter} = this.props;
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxOpButton：", "#3c3");
        return search ? (
            <span>
                <Input.Search {...search} onChange={Op.onChange(this)}
                              value={searchText}/>
                &nbsp;&nbsp;
                <Button.Group>
                    <Button icon={"redo"} htmlType={"button"} onClick={Op.onClear(this)}/>
                    {advanced ? (
                        <Button icon={"filter"} htmlType={"button"}
                                onClick={Op.onOpen(this)}/>
                    ) : false}
                </Button.Group>
                {advanced ? (
                    <IxDrawer $visible={visible} $config={advanced}>
                        <FormFilter/>
                    </IxDrawer>
                ) : false}
            </span>
        ) : false;
    }
}

export default Component;