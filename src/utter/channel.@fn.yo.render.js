import Ux from 'ux';
import {LoadingContent} from "web";
import React from 'react';

const aiColor = (reference, color) => {
    const hasLoading = reference.state.$loading;
    const hasSubmit = reference.state.$submitting;
    const hasSpin = reference.state.$spinning;
    if (hasSubmit || hasSpin || hasLoading) {
        return {
            color: "#9E9E9E",
            text: "Loading..."
        }
    } else {
        return {
            color,
            text: "Loaded"
        }
    }
}
export default (reference = {}, fnJsx, debug = {}) => {
    const state = reference.state ? reference.state : {};
    const {error} = state;
    if (error) {
        /*
         * fxError 已经切换 fxFailure
         */
        return Ux.E.fxFailure(error);
    } else {
        /*
         * Debug专用
         */
        const props = reference.props;
        const {name, color, monitor = true} = debug;
        const {$ready = false} = state;

        const {$height} = props;
        if ($ready) {
            const message = {props, state};
            if (!debug.off) {
                // 组件级打印
                const parsed = aiColor(reference, color);
                Ux.dgDebug(message, `[ ${name} ] ${parsed.text} `, parsed.color);
                if (monitor) {
                    Ux.DevTool(reference).store(name);      // 加载专用Monitor工具
                }
            }
            return Ux.isFunction(fnJsx) ? fnJsx() : fnJsx;
        } else {
            if (!debug.off && debug.loading) {
                Ux.dgDebug({props, state}, `............ [ ${name} ] `, "#9E9E9E");
            }
            const {skin = {}} = reference.props;
            return (<LoadingContent $height={$height} skin={skin}/>);
        }
    }
}