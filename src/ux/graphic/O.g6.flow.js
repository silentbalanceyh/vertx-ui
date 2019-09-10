import Abs from "../abyss";
import G6 from "@antv/g6";
import G6Plugins from "@antv/g6/build/plugins";
import Cmn from "./I.common";


/**
 * id - div的HTML对应id
 * config - items：数据本身
 * config: 其他配置信息
 */
export default (id, config = {}) => {
    const items = Abs.clone(config.items);
    Cmn.drawRegistry();
    if (!config.layout) config.layout = {};
    G6.registerNode('rect', {
        getPath(item) {
            const width = (config.layout.width ? config.layout.width : 130);   // 一半宽
            const height = 32;  // 一半高
            return G6.Util.getRectPath(-width / 2, -height / 2, width, height, 10);
        },
    });
    const graph = new G6.Graph({
        container: id,
        fitView: 'autoZoom',
        fitViewPadding: 20,
        height: config.layout.height ? config.layout.height : window.innerHeight, // 画布高
        plugins: [new G6Plugins['layout.dagre']()],
        defaultIntersectBox: 'rect' // 使用矩形包围盒
    });

    graph.node({
        shape: 'rect',
        label(model) {
            return model.name;
        },
        style: {
            padding: 5
        }
    });
    graph.edge({
        style: {
            endArrow: true
        }
    });
    graph.read(items);
    graph.draw();
};