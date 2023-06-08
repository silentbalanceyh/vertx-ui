import func_ask_ai_form_external from './ask.fn.ai.form.external';
import func_ask_ai_form_external_uca from './ask.fn.ai.form.external.uca';

import func_aureole_v4_child from './aureole.fn.ai.child.v4.patch';

import func_autonomy_ai_action from './autonomy.fn.ai.action';
import func_autonomy_ai_child from './autonomy.fn.ai.child';

import func_automatic_ai_control_menu from './automatic.fn.ai.control.menu';
import func_automatic_ai_control_tab from './automatic.fn.ai.control.tab';
import func_automatic_ai_control_tree from './automatic.fn.ai.control.tree';

import func_autonomy_ai_error from './autonomy.fn.ai.error';

import func_autonomy_ai_unit_buttons from './autonomy.fn.ai.unit.buttons';
import func_autonomy_ai_unit_element from './autonomy.fn.ai.unit.element';
import func_autonomy_ai_unit_link from './autonomy.fn.ai.unit.link';

import func_autonomy_ai_view from './autonomy.fn.ai.view';
import func_autonomy_ui_cloud_element from './autonomy.fn.ui.cloud.element';

import func_behavior_rx_checked from './behavior.fn.rx.checked';
import func_behavior_rx_workflow from './behavior.fn.rx.workflow';

import func_chart_g2_util_lifecycle from './chart.fn.g2.util.lifecycle';
import func_chart_g2_viewer_graph from './chart.fn.g2.viewer.graph';

import func_drag_drop_dnd_operation from './drag.drop.fn.dnd.operation';

import func_equip_cab_cap_dual from './equip.fn.cab.cap.dual';
import func_equip_config_container from './equip.fn.config.container';
import func_equip_config_element from './equip.fn.config.element';
import func_equip_plugin_extension from './equip.fn.plugin.extension';
import func_equip_width_calculate from './equip.fn.width.calculate';

import func_form_equip_raft_phase from './form.equip.fn._.raft.phase';
import func_form_toolkit from './form.fn._.toolkit';
import func_form_connect_trigger from './form.fn.connect.trigger';
import func_form_submit_data_io from './form.submit.fn.data.io';
import func_form_submit_form_antd4 from './form.submit.fn.form.antd4';

import func_statistic_aggr_elementary from './statistic.fn.aggr.elementary';

import func_table_config_table from './table.fn.config.table';
import func_table_config_executor from './table.fn.config.executor';
import func_table_variant_column from './variant-column';

import func_workflow_value_exchange from './workflow.fn.value.exchange';
// 将来会拿掉
import remove_func_in_future from './index.remove.future';
import V_UCA_CONTAINER from './variant-uca-container';
import V_UCA_CONTROL from './variant-uca';

export default {
    V_UCA_CONTAINER,
    /**
     * # 子系统：UCA
     * <hr/>
     * @module uca/zest
     */
    V_UCA_CONTROL,

    /**
     * # 子系统：智能化
     * <hr/>
     *
     * @module ai/zest
     */
    ...func_ask_ai_form_external,       // $DOC
    ...func_ask_ai_form_external_uca,   // $DOC

    /**
     * # 子系统：V4补丁
     * <hr/>
     *
     * @module v4/zest
     */
    ...func_aureole_v4_child,           // $DOC
    /**
     * # 子系统：组件渲染
     * <hr/>
     *
     * @module ai-web/zest
     */
    ...func_automatic_ai_control_menu,  // $DOC
    ...func_automatic_ai_control_tab,   // $DOC
    ...func_automatic_ai_control_tree,  // $DOC

    ...func_autonomy_ai_action,         // $DOC
    ...func_autonomy_ai_child,          // $DOC

    ...func_autonomy_ai_error,          // $DOC
    ...func_autonomy_ai_unit_element,   // $DOC
    ...func_autonomy_ai_unit_link,      // $DOC
    /**
     * # 子系统：组件渲染
     * <hr/>
     *
     * @module ai-form/zest
     */
    ...func_autonomy_ai_unit_buttons,   // $DOC

    ...func_autonomy_ai_view,           // $DOC
    /**
     * # 子系统：JSX渲染
     *
     * <hr/>
     *
     * @module ui/zest
     */
    ...func_autonomy_ui_cloud_element,  // $DOC

    /**
     * # 子系统：函数
     *
     * <hr/>
     *
     * @module rx/zest
     */
    ...func_behavior_rx_checked,        // $DOC
    ...func_behavior_rx_workflow,       // $DOC
    /**
     * # 子系统：图表
     *
     * <hr/>
     *
     * @module g2/zest
     */
    ...func_chart_g2_util_lifecycle,    // $DOC
    ...func_chart_g2_viewer_graph,      // $DOC
    /**
     * # 子系统：拖拽
     *
     * <hr/>
     *
     * @module dnd/zest
     */
    ...func_drag_drop_dnd_operation,    // $DOC
    /**
     * # 子系统：配置
     *
     * <hr/>
     *
     * @module config/zest
     */
    ...func_equip_cab_cap_dual,         // $DOC
    ...func_equip_config_container,     // $DOC

    /**
     * # 子系统：值处理
     *
     * <hr/>
     *
     * @module data/zest
     */
    ...func_equip_config_element,       // $DOC
    /**
     * # 子系统：插件
     *
     * <hr/>
     *
     * @module plugin/zest
     */
    ...func_equip_plugin_extension,      // $DOC
    /**
     * # 子系统：宽度
     *
     * <hr/>
     *
     * @module width/zest
     */
    ...func_equip_width_calculate,      // $DOC

    /**
     * # 子系统：转换函数
     *
     * <hr/>
     *
     * @module to/zest
     */
    ...func_form_equip_raft_phase,      // $DOC
    /**
     * # 子系统：宽度
     *
     * <hr/>
     *
     * @module atomic/zest
     */
    ...func_form_connect_trigger,       // $DOC
    /**
     * # 子系统：迭代
     *
     * <hr/>
     *
     * @module it/zest
     */
    ...func_form_toolkit,               // $DOC

    ...func_form_submit_data_io,        // $DOC
    /**
     * # 子系统：表单处理
     *
     * <hr/>
     *
     * @module form/zest
     */
    ...func_form_submit_form_antd4,     // $DOC

    /**
     * # 子系统：统计处理
     *
     * <hr/>
     *
     * @module aggr/zest
     */
    ...func_statistic_aggr_elementary, // $DOC

    ...func_table_config_table, // $DOC
    ...func_table_config_executor, // $DOC

    /**
     * # 子系统：列变体
     *
     * <hr/>
     *
     * @module column/zest
     */
    ...func_table_variant_column,   // $DOC

    /**
     * # 子系统：值处理
     *
     * <hr/>
     *
     * @module value/zest
     */
    ...func_workflow_value_exchange,

    ...remove_func_in_future
}