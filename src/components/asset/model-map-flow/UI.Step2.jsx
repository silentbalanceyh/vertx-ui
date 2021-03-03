import {OpsModelStep} from "app";
import React from "react";
import Ux from 'ux';
import Ex from 'ex';
import {Button} from 'antd';
import UIPage from './page1/UI';
import Op from './Op.connect';

export default {
    page: (reference) => {
        const {
            $step, $stepSub = 0, $data = {},
            $columns = [], $tableNames = []
        } = reference.state;
        return (
            <div>
                <OpsModelStep $step={$step}/>
                <UIPage {...Ex.yoAmbient(reference)}
                        $step={$stepSub}
                        $data={$data}
                        $columns={$columns}
                        $tableNames={$tableNames}
                        rxNextPage={Op.rxTopNextPage(reference)}
                        rxNext={Op.rxTopNext(reference)}/>
            </div>
        )
    },
    op: (reference) => {
        const button = Ux.fromHoc(reference, "op");
        const {$stepSub = 0} = reference.state;
        return (
            <div className={"ops-model-op"}>
                <Button onClick={event => {
                    Ux.prevent(event);
                    if (0 === $stepSub) {
                        reference.setState({$step: 0})
                    } else {
                        const stepSub = $stepSub - 1;
                        reference.setState({$stepSub: stepSub});
                    }
                }}>{button.prev}</Button>
                <Button type={"primary"} onClick={event => {
                    Ux.prevent(event);
                    const id = `$opStep${$stepSub + 1}`;
                    Ux.connectId(id);
                }}>
                    {$stepSub < 2 ? button.next : button.phase}
                </Button>
            </div>
        );
    }
}