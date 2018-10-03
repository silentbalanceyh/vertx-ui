import Ux from 'ux';
import React from 'react';
import {DebugMonitorTool} from 'web';
import Column from './Mt.Tool.Column';

const renderTool = (reference) => {
    if (Ux.Env.MONITOR) {
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
const renderColumn = (columns = []) => {
    // value专用
    columns.forEach(column => Column.vtValue(column))
};
export default {
    renderTool,
    renderColumn
}