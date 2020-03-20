import React from "react";
import {Topology} from "editor";
import {Grid} from '@antv/g6/build/plugins';

export default (reference) => {
    const {
        graphConfig = {},
        executor = {},
        data = {
            nodes: [],
            edges: []
        },
    } = reference.props;
    const grid = new Grid();
    const $graphConfig = {
        ...graphConfig,
        plugins: [grid],
        layout: {
            preventOverlap: true,
            linkDistance: 166
        }
    };
    return (
        <Topology data={data}
                  graphConfig={$graphConfig}
                  {...executor}/>
    )
}