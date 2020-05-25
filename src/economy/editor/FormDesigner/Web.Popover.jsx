import React from 'react';
import UiModel from './command/UI.Model';

export default {
    layout: (reference) => {
        return (
            <div>内容</div>
        )
    },
    "deployment-unit": (reference) => {
        /* 模型查看器 */
        const {$models = {}, $modelsAttr} = reference.state;
        return (
            <UiModel data={$models} $status={$modelsAttr}/>
        )
    }
}