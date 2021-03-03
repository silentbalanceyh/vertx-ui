import React from 'react';
import Ux from "ux";
import Top from "../Op";
import Ex from "ex";
import {Col, Row} from "antd";
import {NavSwallow} from "web";
import UISummary from "../UI.Summary";
import Op from "./Op";

import Step1Form from "./UI.Step1";
import Step2Form from "./UI.Step2";
import Step3Form from "./UI.Step3";
import StepTable from './UI.Table';

@Ux.zero(Ux.rxEtat(require("../Cab"))
    .cab("UI.Page2")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Top.yiStep2(this);
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
                        const {relation = {}, ...rest} = $data;
                        const $inited = Object.assign({}, rest, relation);
                        if (0 === $step) {
                            return (
                                <StepTable {...Ex.yoAmbient(this)}
                                           data={$inited.relations}/>
                            );
                        } else if (1 === $step) {
                            return (<Step1Form {...Ex.yoAmbient(this)}
                                               $inited={$inited}
                                               $tableNames={$tableNames}
                                               rxNext={Op.rxNext(this)}/>)
                        } else if (2 === $step) {
                            const {$columns = []} = this.props;
                            return (<Step2Form {...Ex.yoAmbient(this)}
                                               $inited={$inited}
                                               $source={$columns}
                                               rxNext={Op.rxNext(this)}/>)
                        } else if (3 === $step) {
                            const {$columns = [], $columnsTo = []} = this.props;
                            return (<Step3Form {...Ex.yoAmbient(this)}
                                               $source={$columnsTo}
                                               $target={$columns}
                                               $inited={$inited}
                                               $tableNames={$tableNames}
                                               rxFirst={Op.rxNextPage(this, false)}
                                               rxNext={Op.rxNextPage(this)}/>)
                        }
                    })()}
                    {(() => {
                        return (
                            <UISummary $container={this.container} data={$data}/>
                        )
                    })()}
                </div>
            )
        }, Ex.parserOfColor("PxPhase2").control())
    }
}

export default Component