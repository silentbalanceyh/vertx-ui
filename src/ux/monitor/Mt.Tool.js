import Ux from 'ux';
import React from 'react';
import {DebugMonitorTool} from 'web'

const renderTool = (reference) => {
    if (Ux.Env.NODE_ENV === "development") {
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
    columns.forEach(column => {
        if ("value" === column.dataIndex) {
            column.render = (text, record) => {
                if ("boolean" === record.type) {
                    if (text) {
                        return (<span style={{
                            color: "#f66"
                        }}>true</span>)
                    } else {
                        return (<span style={{
                            color: "#039"
                        }}>false</span>)
                    }
                } else if ("string" === record.type) {
                    return (<span style={{
                        color: "#393"
                    }}>{`"${text}"`}</span>)
                } else if ("number" === record.type) {
                    return (<span style={{
                        color: "#990"
                    }}>{text}</span>)
                }
            }
        }
    })
};
export default {
    renderTool,
    renderColumn
}