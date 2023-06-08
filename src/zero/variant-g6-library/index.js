import __LVC from './index.triple';

import __ADD_ON from './index.addon';

import REGISTRY from './index.registry';

import GRAPH from './index.graph';

export default {
    /*
     * L
     * V
     * C
     */
    ...__LVC,
    /*
     * ADDON,
     * ADDON_PLUGIN
     */
    ...__ADD_ON,
    /*
     * GRAPH
     */
    GRAPH,

    REGISTRY,
}