import Ux from 'ux';
import React from 'react';
import {DebugMonitorTool} from 'web'

const renderTool = (reference) => {
    if (Ux.Env.DEBUG) {
        // 开发过程才会出现
        return (
            <div className={"zero-debug-tool"}>
                <DebugMonitorTool {...reference.props} reference={reference}/>
            </div>
        );
    } else {
        return false;
    }
};
export default {
    renderTool
}