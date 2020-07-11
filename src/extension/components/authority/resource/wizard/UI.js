import React from 'react';
import Ux from 'ux';
import Op from './Op';
import Ex from "ex";
import {Steps} from 'antd';
import Jsx from './Web';
import {LoadingContent} from 'web';
import renderNav from './Web.Navigation';

@Ux.zero(Ux.rxEtat(require("../Cab"))
    .cab("UI.Perm.Wizard")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiWizard(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuWizard(this, {props: prevProps, state: prevState});
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$step = 0, $stepConfig = []} = this.state;
            return (
                <div className={"wizard"}>
                    <div className={"web-help"}>
                        <Steps size={"small"} current={$step}>
                            {$stepConfig.map(item => <Steps.Step {...item}/>)}
                        </Steps>
                    </div>
                    <div className={"web-action"}>
                        {renderNav(this)}
                    </div>
                    <div className={"web-form"}>
                        {(() => {
                            const executor = Jsx[$step];
                            if (Ux.isFunction(executor)) {
                                const {$readyPart = false} = this.state;
                                if ($readyPart) {
                                    return executor(this);
                                } else {
                                    return (
                                        <LoadingContent/>
                                    )
                                }
                            } else return false;
                        })()}
                    </div>
                </div>
            )
        }, Ex.parserOfColor("PxPermissionWizard").define());
    }
}

export default Component