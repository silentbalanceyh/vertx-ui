import {Graph} from "@antv/x6";
import V from '../element-style';

export default (name) => Graph.registerEdge(name, {
    inherit: 'edge',
    ...V.CI_EDGE,
    router: 'manhattan',
}, true)