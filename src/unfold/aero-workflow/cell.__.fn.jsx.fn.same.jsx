import Ux from "ux";
import __Zn from './zero.workflow.dependency';
import React from "react";
import {ExLinkage,} from '../aero-extenion';
import jsxListFn from './workflow.i.@fn.jsx.list';

const jsxLinkageFn = (reference, field) => (ref) => {
    const $workflow = Ux.ambValue(reference, "$workflow");
    const {$inited = {}, $mode} = ref.props;
    const inherit = __Zn.yoAmbient(reference);
    inherit.$inited = $inited;

    const {config = {}} = $workflow;
    const configLinkage = config.linkage ? config.linkage : {};
    inherit.config = configLinkage[field] ? configLinkage[field] : {};
    inherit.$mode = $mode
    inherit.$renders = jsxListFn(reference);
    // koSelection 构造
    const $config = inherit.config ? inherit.config : {};
    const {selection = {}} = $config.editor ? $config.editor : {};
    const $plugins = {};
    if (Ux.isNotEmpty(selection)) {
        $plugins.koSelection = (record = {}) => {
            let allow = true;
            const keys = Object.keys(selection);
            for (let idx = 0; idx < keys.length; idx++) {
                const field = keys[idx];
                const expected = selection[field];
                // 默认值包含
                if (expected.includes(null)) {
                    expected.push(undefined);
                }
                const checked = expected.includes(record[field]);
                if (!checked) {
                    allow = false;
                    break;
                }
            }
            return allow;
        }
    }
    inherit.$plugins = $plugins;
    // linkage 补充
    const $initial = {};
    $initial.region = $workflow['definitionKey'];
    inherit.$initial = $initial;
    return <ExLinkage {...inherit}/>
}
export default {
    jsxLinkageFn,
}