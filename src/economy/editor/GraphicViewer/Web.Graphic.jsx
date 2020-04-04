import React from 'react';
import {Grid} from '@antv/g6/build/plugins';
import {Topology} from 'editor';

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
                center: [270, 270],
                type: 'radial',
                preventOverlap: true,
                maxPreventOverlapIteration: 1000,
                strictRadial: true,
                linkDistance: 320,
                unitRadius: 300,
                nodeSize: 168,
            }
        })}/>
    )
}