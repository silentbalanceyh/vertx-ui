import func_idyl_rs_state from './idyl.fn.rs.state';
import func_idyl_rx_container_batch from './idyl.fn.rx.container.batch';
import func_idyl_rx_container_tab from './idyl.fn.rx.container.tab';
import func_idyl_rx_qr_criteria from './idyl.fn.rx.ir.criteria';
import func_idyl_rx_qr_qbe from './idyl.fn.rx.qr.qbe';
import func_idyl_rx_qr_view from './idyl.fn.rx.qr.view';
import func_idyl_rx_row_action from './idyl.fn.rx.row.action';
import func_idyl_rx_source from './idyl.fn.rx.source';
import func_idyl_rx_state from './idyl.fn.rx.state';

import func_habit_config_control from './habit.fn.config.control';
import func_habit_config_event from './habit.fn.config.event';
import func_habit_up_pre_condition from './habit.fn.up.pre.condition';
import func_habit_parser_action from './habit.fn.parser.action';

import func_lkway_on_application from './lkway.fn.on.application';
import func_lkway_on_relation_ship from './lkway.fn.on.relation.ship';

import func_kind_a4_menu_item from './kind.fn.a4.menu.item';

import func_rapid_sex_ex_action from './rapid.fn.sex.ex.action';

import func_levy_in_economy_remote from './levy.fn.in.economy.remote';

import func_pedestal_map_pipeline from './pedestal.fn.map.pipeline';
import func_pedestal_to_atom from './pedestal.fn.to.atom';
import func_pedestal_to_web_control from './pedestal.fn.to.web.control';

import func_tracer_parser_logging from './tracer.fn.parser.logging';

import v_pedestal_constant_option from './pedestal.v.constant.option';
// yo / yi / yu
import index_entry_channel from './channel.zero.index';

export default {
    /**
     * # 扩展底座：AntD 4
     *
     * <hr/>
     * @module v4/utter
     */
    ...func_kind_a4_menu_item,  // $DOC

    /**
     * # 扩展底座：数据标准化
     * <hr/>
     * @module in/utter
     */
    ...func_levy_in_economy_remote, // $DOC
    /**
     * # 扩展底座：一阶状态函数
     *
     * <hr/>
     * @module rs/utter
     * @deprecated
     */
    ...func_idyl_rs_state,      // $DOC
    /**
     * # 扩展底座：二阶函数
     *
     * <hr/>
     * @module rx/utter
     */
    ...func_idyl_rx_container_batch, // $DOC
    ...func_idyl_rx_container_tab,   // $DOC

    ...func_idyl_rx_qr_qbe,             // $DOC
    ...func_idyl_rx_qr_view,            // $DOC
    ...func_idyl_rx_row_action,         // $DOC
    ...func_idyl_rx_source,             // $DOC
    ...func_idyl_rx_state,              // $DOC
    /**
     * # 扩展底座：查询引擎函数
     *
     * <hr/>
     * @module qr/utter
     */
    ...func_idyl_rx_qr_criteria,        // $DOC
    /**
     * # 扩展底座：配置管理
     *
     * <hr/>
     * @module config/utter
     */
    ...func_habit_config_control,       // $DOC
    ...func_habit_config_event,         // $DOC
    /**
     * # 扩展底座：解析器
     *
     * <hr/>
     * @module parser/utter
     */
    ...func_habit_parser_action,        // $DOC
    /**
     * # 扩展底座：更新检查函数
     *
     * <hr/>
     * @module up/utter
     */
    ...func_habit_up_pre_condition,  // $DOC

    /**
     * # 扩展底座：通道执行
     *
     * <hr/>
     * @module on/utter
     */
    ...func_lkway_on_application,   // $DOC
    ...func_lkway_on_relation_ship, // $DOC

    /**
     * # 扩展底座：快速开发
     *
     * <hr/>
     * @module sex/utter
     */
    ...func_rapid_sex_ex_action,   // $DOC

    /**
     * # 扩展底座：映射管道
     *
     * <hr/>
     * @module map/utter
     */
    ...func_pedestal_map_pipeline, // $DOC

    /**
     * # 扩展底座：转换函数
     *
     * <hr/>
     * @module to/utter
     */
    ...func_pedestal_to_atom,  // $DOC
    ...func_pedestal_to_web_control,     // $DOC
    /**
     * # 扩展函数：对接层
     * <hr/>
     * @module ux/utter
     */
    ...func_tracer_parser_logging,     // $DOC
    // index.entry.channel
    ...index_entry_channel, // $DOC
    /**
     * # 扩展底座：常量
     *
     * <hr/>
     * @module constant/utter
     */
    ...v_pedestal_constant_option,  // $DOC
}