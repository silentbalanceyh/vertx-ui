import React from 'react';
import {Button} from 'antd';

import Op from './Op';
import {Dialog, uca} from "zi";
import renderContent from './Web.Content';
import __Zn from '../zero.uca.dependency';

@uca({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        return __Zn.xtReady(this, () => {
            const {$button = {}, $dialog = {}, $visible = false} = this.state;
            const {disabled = false} = this.props;
            return (
                <div className={"web-restful"}>
                    <Button icon={__Zn.v4Icon("api")} className={"uc_pink"}
                            disabled={disabled}
                            onClick={Op.onClick(this)}>
                        {$button.text}
                    </Button>
                    <Dialog className={"ux_dialog"}
                            size={"small"}
                            $visible={$visible}
                            $dialog={$dialog}
                            rxOk={Op.onSubmit(this)}>
                        {$visible ? renderContent(this) : false}
                    </Dialog>
                </div>
            );
        });
    }
}

export default Component