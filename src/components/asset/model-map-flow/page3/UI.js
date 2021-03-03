import React from 'react';
import Ux from "ux";
import Top from "../Op";
import Ex from "ex";
import {Col, Row} from "antd";
import {NavSwallow} from "web";
import UISummary from "../UI.Summary";

import StepTable from './UI.Table';
import Step1Form from "./UI.Step1";
import Step2Form from "./UI.Step2";
import Step3Form from './UI.Step3';
import Step4Form from './UI.Step4';

import Op from "./Op";

@Ux.zero(Ux.rxEtat(require("../Cab"))
    .cab("UI.Page3")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Top.yiStep3(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$step = 0, $data = {}, $tableNames = []} = this.props;
            return (
                <div className={"ops-model-page"} ref={node => this.container = node}>
                    <Row>
                        <Col span={24}>
                            <div className={"ops-model-help"}>
                                {(() => {
                                    if (0 === $step) {
                                        return Ux.fromHoc(this, "title");
                                    } else {
                                        const steps = Ux.fromHoc(this, "helps");
                                        return (<NavSwallow $steps={steps} $common={false} $current={$step - 1}/>)
                                    }
                                })()}
                            </div>
                        </Col>
                    </Row>
                    {(() => {
                        const {action = {}, ...rest} = $data;
                        const $inited = Object.assign({}, rest, action);
                        if (0 === $step) {
                            return (
                                <StepTable {...Ex.yoAmbient(this)}
                                           data={$inited.actions}/>
                            );
                        } else if (1 === $step) {
                            return (<Step1Form {...Ex.yoAmbient(this)}
                                               $inited={$inited}
                                               $tableNames={$tableNames}
                                               rxNext={Op.rxNext(this)}/>
                            )
                        } else if (2 === $step) {
                            const {$columns = []} = this.props;
                            return (<Step2Form {...Ex.yoAmbient(this)}
                                               $inited={$inited}
                                               $source={$columns}
                                               rxNext={Op.rxNext(this)}/>)
                        } else if (3 === $step) {
                            const {$columns = []} = this.props;
                            return (<Step3Form {...Ex.yoAmbient(this)}
                                               $inited={$inited}
                                               $target={$columns}
                                               rxNext={Op.rxNext(this)}/>);
                        } else if (4 === $step) {
                            const {$columns = [], $columnsTo = []} = this.props;
                            return (<Step4Form {...Ex.yoAmbient(this)}
                                               $source={$columnsTo}
                                               $target={$columns}
                                               $inited={$inited}
                                               $tableNames={$tableNames}
                                               rxFirst={Op.rxNextPage(this, false)}
                                               rxNext={Op.rxNextPage(this)}/>)
                        } else return false;
                    })()}
                    {(() => {
                        return (
                            <UISummary $container={this.container} data={$data}/>
                        )
                    })()}
                </div>
            )
        }, Ex.parserOfColor("PxPhase3").control())
    }
}

export default Component