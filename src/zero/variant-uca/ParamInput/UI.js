import React from 'react';
import {Button, Popover, Tag, Tooltip} from 'antd';
import Op from './Op';
import {Dialog, uca} from "zi";

import __Zn from '../zero.uca.dependency';


import renderContent from "./Web.Content";
import ReactJson from "react-json-view";

@uca({
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
        return __Zn.xtReady(this, () => {
            const {$op = {}, $dialog = {}, $visible = false, data = []} = this.state;
            const {value = {}} = this.props;
            return (
                <div className={"web-param-parser"}>
                    <Button.Group>
                        <Tooltip title={$op.edit}>
                            <Button icon={__Zn.v4Icon("edit")} className={"uc_brown"} onClick={(event) => {
                                __Zn.prevent(event);
                                __Zn.of(this).open().done();
                                // this.?etState({$visible: true})
                            }}/>
                        </Tooltip>
                        <Tooltip title={$op.search}>
                            <Popover trigger={"click"} placement={"right"}
                                     content={<ReactJson src={value} name={null}
                                                         enableClipboard={false}/>}
                                     overlayClassName={"json-types"}
                                     overlayStyle={{minWidth: 480}}>
                                <Button icon={__Zn.v4Icon("search")}/>
                            </Popover>
                        </Tooltip>
                    </Button.Group>
                    &nbsp;&nbsp;
                    <Tag style={{
                        fontSize: 14
                    }}>
                        {(() => {
                            const expr = $op.report;
                            return __Zn.formatExpr(expr, {counter: data.length})
                        })()}
                    </Tag>
                    <Dialog className={"ux_dialog"}
                            size={"small"}
                            $visible={$visible}
                            $dialog={$dialog}>
                        {renderContent(this)}
                    </Dialog>
                </div>
            );
        });
    }
}

export default Component