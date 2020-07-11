import UIPerm from '../form/UI.Perm.Step1';
import UIAction from '../form/UI.Perm.Step2';
import UIDone from '../form/UI.Perm.Done';

import Ex from "ex";
import React from "react";
import Ux from 'ux';
import Op from './Op';
import {Spin} from 'antd';

export default {
    0: (reference) => {
        const {$data = {}, $wizard} = reference.state;
        /*
         * wizard 数据信息
         * 1）$data （第一步之前的数据）
         * 2）$wizard[0]（第一步之后的数据）
         */
        let input = Ux.clone($data);
        if ($wizard) {
            input = Ux.clone($wizard);
        }
        const {permissions = []} = $data;
        return (<UIPerm {...Ex.yoAmbient(reference)}
                        $inited={input}
                        $permissions={permissions}
                        rxNext={Op.rxNext(reference)}/>);
    },
    1: (reference) => {
        const {$wizard, $removed = new Set(), $submitting = false} = reference.state;
        if ($wizard) {
            return (
                <Spin spinning={$submitting}>
                    <UIAction {...Ex.yoAmbient(reference)}
                              $inited={$wizard}
                              $removed={Array.from($removed)}
                              rxNext={Op.rxNext(reference)}
                              rxDelete={Op.rxDelete(reference)}
                              rxAdd={Op.rxAdd(reference)}/>
                </Spin>
            )
        } else return false;
    },
    2: (reference) => {
        const {data = {}} = reference.props;
        return (
            <UIDone {...Ex.yoAmbient(reference)}
                // 组信息
                    data={data.__group}
                    rxBack={() => reference.setState({$readyPart: false})}/>
        )
    }
}