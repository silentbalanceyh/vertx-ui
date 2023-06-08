import {Graph} from "@antv/x6";
import __TRIPLE from './index.triple';

const V = __TRIPLE.V;

export default (name) => Graph.registerEdge(name, {
    inherit: 'edge',
    ...V.CI_EDGE,
}, true)