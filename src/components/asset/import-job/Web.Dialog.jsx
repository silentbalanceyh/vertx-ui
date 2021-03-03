import Ux from 'ux';
import Ex from 'ex';
import {Modal} from 'antd';
import React from 'react';
import FormStep1 from './form/UI.Step1';
import FormStep2 from './form/UI.Step2';
import FormStep3 from './form/UI.Step3';
import {Of} from 'app';
import Op from './Op.Event';

export default (reference) => {
    const {
        $dialog = [], $dialogStep = 1, $visible = false,
        $dialogData = {},
    } = reference.state;
    if ($dialog[$dialogStep]) {
        const dialog = Ux.clone($dialog[$dialogStep]);
        return (
            <Modal {...dialog} visible={$visible}>
                {(() => {
                    if (0 === $dialogStep) {
                        return (
                            <FormStep1 {...Ex.yoAmbient(reference)} $inited={$dialogData}/>
                        )
                    } else if (1 === $dialogStep) {
                        return (
                            <FormStep2 {...Ex.yoAmbient(reference)} $inited={$dialogData}
                                       rxSubmit={values => {
                                           // 发送请求添加成功
                                           const startDateStr = [];
                                           const {startDate = [], startTime = []} = values;
                                           startDate.forEach(item => startDateStr.push(item.toISOString()));
                                           const startTimeStr = [];
                                           startTime.forEach(item => startTimeStr.push(item.toISOString()));
                                           values.startDate = startDateStr;
                                           values.startTime = startTimeStr;
                                           // 直接调用统一函数
                                           Op.dataAjax(reference, Of.apiTaskCreate, "saved")(values, {
                                               $dialogStep: 0,
                                               $dialogData: undefined,
                                               $visible: false,
                                           });
                                       }}/>
                        )
                    } else if (2 === $dialogStep) {
                        return (
                            <FormStep3 {...Ex.yoAmbient(reference)} $inited={$dialogData}
                                       rxSubmit={() => reference.setState({$dialogStep: 0})}/>
                        );
                    }
                })()}
            </Modal>
        )
    } else return false;
}