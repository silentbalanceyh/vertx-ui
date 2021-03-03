import {OpsModelStep} from "app";
import React from "react";
import Ux from 'ux';
import {Button} from 'antd';
import UIPage from "./page2/UI";
import Ex from "ex";
import Op from "./Op.connect";

export default {
    page: (reference) => {
        const {
            $step,
            $stepSub = 0,
            $data = {},
            $columnsRel = [],
            $columns = [],
            $tableNames = []
        } = reference.state;
        return (
            <div>
                <OpsModelStep $step={$step}/>
                <UIPage {...Ex.yoAmbient(reference)}
                        $step={$stepSub}
                        $data={$data}
                        $columns={$columnsRel}
                        $columnsTo={$columns}
                        $tableNames={$tableNames}
                        rxDelete={Op.rxTopDelete(reference)}
                        rxNextPage={Op.rxTopNextPage(reference)}
                        rxFirstPage={Op.rxTopFirstPage(reference)}
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
                        // 返回上一页
                        reference.setState({$step: 1, $stepSub: 2})
                    } else {
                        const stepSub = $stepSub - 1;
                        reference.setState({$stepSub: stepSub});
                    }
                }}>{button.prev}</Button>
                {0 === $stepSub ? ((() => {
                    return (
                        <Button type="primary" onClick={event => {
                            Ux.prevent(event);
                            const stepSub = $stepSub + 1;
                            reference.setState({$stepSub: stepSub});
                        }}>{button['addRel']}</Button>
                    )
                })()) : false}
                {3 === $stepSub ? ((() => {
                    return (
                        <Button type="primary" onClick={event => {
                            Ux.prevent(event);
                            const id = `$opRestart`;
                            Ux.connectId(id);
                        }}>{button['addRelRedo']}</Button>
                    )
                })()) : false}
                <Button type={"primary"} onClick={event => {
                    if (0 === $stepSub) {
                        Ux.prevent(event);
                        reference.setState({$step: 3, $stepSub: 0})
                    } else {
                        const id = `$opStep${$stepSub}`;
                        Ux.connectId(id);
                    }
                }}>
                    {$stepSub < 3 ? button.next : button.phase}
                </Button>
            </div>
        );
    }
}