import {GPos} from "./g6.__.c.unit.g.pos";
import {ModeLayout} from "./g6.__.v.enum.constant";

const posStencil = (pos: GPos) => {
    const layout: ModeLayout = pos.mode();
    let height = pos.height();
    if (ModeLayout.LeftRight === layout) {
        height += pos.adjust().y;
    }
    return height;
};
export default {
    posCompressH: (pos: GPos, config: any = {}) => {
        if (pos) {
            const css = config.css ? config.css : {};
            const height = css.height ? css.height : 36;
            pos.compress(height, 0);
        }
    },
    posStencil,
    posResize: (pos: GPos,
                graph: any,     // GGraph
                addon: any      // GAddon
    ) => {
        const resized = pos.resizeOn();
        if (resized) {
            const {width, height} = resized;
            const g6Graph = graph.graph();
            g6Graph.resize(width, height);
            // 修改 stencil
            const id = addon.id();
            if (id.stencil) {
                const element: any = document.getElementById(id.stencil);
                if (element) {
                    // 重算
                    element.style.height = `${posStencil(pos)}px`;
                }
            }
        }
    },
}