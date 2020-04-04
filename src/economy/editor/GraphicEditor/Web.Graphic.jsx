import React from "react";
import {Topology} from "editor";
import {Grid} from '@antv/g6/build/plugins';

export default (reference) => {
    const {
        data = {
            nodes: [],
            edges: []
        },
        $event,
    } = reference.props;
    /* 图专用配置 */
    const grid = new Grid();
    return (
        <Topology data={data} {...$event.configGraphic({
            plugins: [grid],
            layout: {
                center: [320, 280],
                type: 'force',
                preventOverlap: true,
                linkDistance: 240,
                nodeSize: 168,
            }
        })}/>
    )
}