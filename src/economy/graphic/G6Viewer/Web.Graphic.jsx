import React from 'react';

export default (reference) => {
    const {
        data = {
            nodes: [],
            edges: []
        },
        $event,
    } = reference.props;
    /* 图专用配置 */
    return (
        <div>
            Viewer
        </div>
    )
}