import G6 from '@antv/g6';
import Ux from 'ux';

Ux.g6Registry([
    'edge-ppt',
    'node-ppt'
])

export default (reference, step) => {
    const {$width = 800} = reference.props;
    const graph = new G6.Graph({
        container: "divPpt",
        width: $width,
        height: 200,
        layout: {
            type: 'dagre',
            rankdir: 'LR',
            ranksep: 30,
            nodesep: 30,
            workerEnabled: true
        },
        fitView: 'force',
        defaultNode: {
            type: 'node-ppt',
            labelCfg: {
                style: {
                    fill: '#000000A6',
                    fontSize: 12,
                },
            },
            style: {
                stroke: '#72CC4A',
                width: 150,
            },
        },
        defaultEdge: {
            type: 'edge-ppt'
        }
    });
    const graphData = Ux.fromHoc(reference, "graphic");
    const {data = {}} = graphData;
    if (step) {
        data.nodes.forEach(item => {
            if (step === item.step) {
                item.active = true;
                item.labelCfg = {
                    style: {
                        fill: 'white'
                    }
                }
            }
        })
    }
    graph.data(data);
    graph.render();
}