import React from 'react';
import {component} from "../../_internal";
import Ux from 'ux';
import {Button} from 'antd';
import './Cab.less';
import Op from './op';
import Dialog from '../../container/Dialog/UI';
import renderContent from './Web.Content';

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
            const {$button = {}, $dialog = {}, $visible = false} = this.state;
            const {$disabled = false} = this.props;
            return (
                <div className={"web-restful"}>
                    <Button icon={"api"} disabled={$disabled}
                            onClick={Op.onClick(this)}>
                        {$button.text}
                    </Button>
                    <Dialog className={"web-dialog"}
                            size={"small"}
                            $visible={$visible}
                            $dialog={$dialog}>
                        {renderContent(this)}
                    </Dialog>
                </div>
            )
        });
    }
}

export default Component