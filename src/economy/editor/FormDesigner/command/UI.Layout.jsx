import React from 'react';
import {component} from "../../../_internal";
import UiForm from '../Web.Form';
import Ux from 'ux';
import Op from '../op';
import layoutView from '../Web.Fn.Layout';

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Layout",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiLayout(this);
    }

    render() {
        /*
         * 配置处理
         */
        const {$inited = {}} = this.props;
        const config = Ux.fromHoc(this, "form");
        return (
            <div className={"viewer-layout"}>
                <UiForm reference={this}
                        config={{form: config}}
                        $op={Op.actions}
                        $renders={{
                            layoutView
                        }}
                        $inited={$inited}/>
            </div>
        );
    }
}

export default Component