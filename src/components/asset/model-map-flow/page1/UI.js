import React from 'react';
import UISummary from '../UI.Summary';
import {NavSwallow} from 'web';
import Ux from "ux";
import Ex from 'ex';
import Top from '../Op';
import Op from './Op';
import {Col, Row} from 'antd';

import Step1Form from './UI.Step1';
import Step2Form from './UI.Step2';
import Step3Form from './UI.Step3';

@Ux.zero(Ux.rxEtat(require("../Cab"))
    .cab("UI.Page1")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Top.yiStep1(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$step = 0, $tableNames = []} = this.props;
            return (
                <div className={"ops-model-page"} ref={node => this.container = node}>
                    <Row>
                        <Col span={24}>
                            <div className={"ops-model-help"}>
                                {(() => {
                                    const steps = Ux.fromHoc(this, "helps");
                                    return (<NavSwallow $steps={steps} $common={false} $current={$step}/>)
                                })()}
                            </div>
                        </Col>
                    </Row>
                    {(() => {
                        const {$data = {}} = this.props;
                        if (0 === $step) {
                            return (<Step1Form {...Ex.yoAmbient(this)}
                                               $inited={$data}
                                               $tableNames={$tableNames}
                                               rxNext={Op.rxNext(this)}/>)
                        } else if (1 === $step) {
                            const {$columns = []} = this.props;
                            return (<Step2Form {...Ex.yoAmbient(this)}
                                               $inited={$data}
                                               $source={$columns}
                                               rxNext={Op.rxNext(this)}/>)
                        } else if (2 === $step) {
                            const {$columns = []} = this.props;
                            return (<Step3Form {...Ex.yoAmbient(this)}
                                               $inited={$data}
                                               $source={$columns}
                                               $tableNames={$tableNames}
                                               rxNext={Op.rxNextPage(this)}/>)
                        }
                    })()}
                    {0 <
                    $step ? ((() => {
                        const {$data = {}} = this.state;
                        return (
                            <UISummary $container={this.container} data={$data}/>
                        )
                    })()) : false
                    }
                </div>
            )
        }, Ex.parserOfColor("PxPhase1").control())
    }
}

export default Component