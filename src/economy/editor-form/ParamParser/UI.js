import React from 'react';
import {Button, Popover, Tag, Tooltip} from 'antd';
import {component} from "../../_internal";
import Ux from 'ux';
import Op from './op';
import Dialog from "../../container/Dialog/UI";
import './Cab.less';

import renderContent from "./Web.Content";
import ReactJson from "react-json-view";

@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuPage(this, {props: prevProps, state: prevState});
    }

    render() {
        return Ux.xtReady(this, () => {
            const {$op = {}, $dialog = {}, $visible = false, data = []} = this.state;
            const {value} = this.props;
            return (
                <div className={"web-param-parser"}>
                    <Button.Group>
                        <Tooltip title={$op.edit}>
                            <Button icon={"edit"} onClick={Op.onClick(this)}/>
                        </Tooltip>
                        <Tooltip title={$op.search}>
                            <Popover trigger={"click"} placement={"right"}
                                     content={<ReactJson src={value} name={null}
                                                         enableClipboard={false}/>}
                                     overlayClassName={"json-types"}
                                     overlayStyle={{minWidth: 480}}>
                                <Button icon={"search"}/>
                            </Popover>
                        </Tooltip>
                    </Button.Group>
                    &nbsp;&nbsp;
                    <Tag style={{
                        fontSize: 14
                    }}>
                        {(() => {
                            const expr = $op.report;
                            return Ux.formatExpr(expr, {counter: data.length})
                        })()}
                    </Tag>
                    <Dialog className={"web-dialog"}
                            size={"small"}
                            $visible={$visible}
                            $dialog={$dialog}>
                        {renderContent(this)}
                    </Dialog>
                </div>
            )
        })
    }
}

export default Component