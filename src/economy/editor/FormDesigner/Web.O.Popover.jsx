import React from 'react';
import UiModel from './command/UI.Model';
import UiLayout from './command/UI.Layout';

export default {
    layout: (reference) => {
        return (<UiLayout reference={reference}/>)
    },
    "deployment-unit": (reference) => {
        /* 模型查看器 */
        const {$models = {}, $modelsAttr} = reference.state;
        return (
            <UiModel data={$models} $status={$modelsAttr}/>
        )
    }
}