import func_rapid_sex_batch from './rapid.fn.sex.batch';
import func_rapid_sex_callback from './rapid.fn.sex.callback';
import func_rapid_sex_configuration from './rapid.fn.sex.configuration';

import func_topology_g6_configuration from './topology.fn.g6.configuration';
import func_topology_g6_data from './topology.fn.g6.data';
import func_topology_g6_page_lifecycle from './topology.fn.g6.page.lifecycle';

import func_topology_x6_action from './topology.fn.x6.action';
import func_topology_x6_ui from './topology.fn.x6.ui';

import func_topology_x6x_rx_bind from './topology.fn.x6x.rx.bind';
import func_topology_x6o_on_bind from './topology.fn.x6o.on.bind';

import func_zero_rx_etat_critical from './zero.fn.rx.etat.critical';

export default {
    /**
     * # Zero：快速开发
     *
     * <hr/>
     *
     * @module sex/zero
     */
    ...func_rapid_sex_batch,        // $DOC
    ...func_rapid_sex_callback,     // $DOC
    ...func_rapid_sex_configuration,// $DOC

    /**
     * # Zero：拓扑图
     *
     * <hr/>
     *
     * @module g6/zero
     */
    ...func_topology_g6_configuration,  // $DOC
    ...func_topology_g6_data,         // $DOC
    ...func_topology_g6_page_lifecycle, // $DOC

    /**
     * # Zero：拓扑交互
     *
     * <hr/>
     *
     * @module x6/zero
     */
    ...func_topology_x6_action, // $DOC
    ...func_topology_x6_ui, // $DOC

    ...func_topology_x6x_rx_bind,   // $DOC
    ...func_topology_x6o_on_bind,   // $DOC
    /**
     * # Zero：函数
     *
     * <hr/>
     *
     * @module rx/zero
     */
    ...func_zero_rx_etat_critical, // $DOC
}