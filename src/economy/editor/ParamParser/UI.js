import React from 'react';
import {Button, Tag, Tooltip} from 'antd';
import {component} from "../../_internal";
import Ux from 'ux';
import Op from './op';
import renderContent from "./Web.Content";
import Dialog from "../../container/Dialog/UI";

@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ux.xtReady(this, () => {
            const {$op = {}, $dialog = {}, $visible = false} = this.state;
            const $data = Op.toValue(this);
            return (
                <div>
                    <Button.Group>
                        <Tooltip title={$op.edit}>
                            <Button icon={"edit"} onClick={Op.onClick(this)}/>
                        </Tooltip>
                        <Tooltip title={$op.search}>
                            <Button icon={"search"}/>
                        </Tooltip>
                    </Button.Group>
                    &nbsp;&nbsp;
                    <Tag style={{
                        fontSize: 14
                    }}>
                        {(() => {
                            const expr = $op.report;
                            return Ux.formatExpr(expr, {counter: $data.length})
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