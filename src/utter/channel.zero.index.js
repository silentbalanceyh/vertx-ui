import yoAmbient from './channel.@fn.yo.ambient';
import yoDynamic from './channel.@fn.yo.dynamic';
import yoRender from './channel.@fn.yo.render';

import func_channel_event_yo_action from './channel.event.fn.yo.action';

import func_channel_cm_yi_container_atom from './channel.cm.fn.yi.container.atom';
import func_channel_cm_yo_container_atom from './channel.cm.fn.yo.container.atom';
import func_channel_cm_yo_container_norm from "./channel.cm.fn.yo.container.norm";
import func_channel_cm_yu_container_atom from './channel.cm.fn.yu.container.atom';

import func_channel_macrocosm_yi_modulat from './channel.macrocosm.fn.yi.modulat';
import func_channel_macrocosm_yo_container from './channel.macrocosm.fn.yo.container';
import func_channel_macrocosm_yo_tpl from './channel.macrocosm.fn.yo.tpl';

import func_channel_form_yi_control from './channel.form.fn.yi.control';
import func_channel_form_yo_control from './channel.form.fn.yo.control';

import func_channel_grid_yi_list_configuration from './channel.grid.fn.yi.list.configuration';
import func_channel_grid_yi_list_container from './channel.grid.fn.yi.list.container';
import func_channel_grid_yi_list_op from './channel.grid.fn.yi.list.op';

import func_channel_grid_yo_list from './channel.grid.fn.yo.list';
import func_channel_grid_yo_list_segment from './channel.grid.fn.yo.list.segment';
import func_channel_grid_yo_qr_qbe from './channel.grid.fn.yo.qr.qbe';

// Yi
import yiStandard from './channel.@fn.yi.standard';
import yiAssist from './channel.@fn.yi.assist';
// Xui
import xuiContainer from './aero.@fn.xui.container';
import func_aero_xui_component from './aero.fn.xui.component';

export default {
    /**
     * # 扩展底座：高阶渲染
     *
     * <hr/>
     * @module xui/utter
     */
    xuiContainer,
    // xuiGrid
    // xuiDecorator
    ...func_aero_xui_component,  // $DOC
    // ========================================= Yi
    /**
     * # 通道：初始化
     *
     * <hr/>
     * @module yi/utter
     */
    yiAssist,
    yiStandard,
    // yiContainer
    // yiControl
    ...func_channel_cm_yi_container_atom,  // $DOC
    // yiCombine
    // yiModule
    ...func_channel_macrocosm_yi_modulat,  // $DOC
    // yiFormPart
    ...func_channel_form_yi_control,            // $DOC
    // yiListQuery
    // yiListOptions
    // yiListSynonym
    // yiListPlugin
    // yiListLazy
    // yiColumn
    ...func_channel_grid_yi_list_configuration, // $DOC
    // yiListTable
    // yiListView
    // yiListTab
    ...func_channel_grid_yi_list_container,// $DOC
    // yiListOp
    ...func_channel_grid_yi_list_op,// $DOC
    // ========================================= Yo
    /**
     * # 通道：渲染
     *
     * <hr/>
     * @module yo/utter
     */
    yoAmbient,
    yoDynamic,
    yoRender,
    // yoAction
    // yoExtension
    ...func_channel_event_yo_action,    // $DOC
    // yoAtomContainer
    // yoAtomComponent
    ...func_channel_cm_yo_container_atom, // $DOC
    // yoTabPage
    // yoDialog
    ...func_channel_macrocosm_yo_container, // $DOC
    // yoContainer
    // yoComponent
    // yoControl
    ...func_channel_cm_yo_container_norm,  // $DOC
    // yoFilter
    // yoForm
    // yoFormAdd
    // yoFormEdit
    ...func_channel_form_yo_control,  // $DOC
    // yoPolymorphism
    // yoGrid
    ...func_channel_grid_yo_list,       // $DOC
    // yoListBatch
    // yoListOpen
    // yoListGrid
    // yoListSearch
    // yoListExtra
    ...func_channel_grid_yo_list_segment,   // $DOC
    // yoQrCond
    // yoQrTag
    // yoQrQBE
    ...func_channel_grid_yo_qr_qbe, // $DOC
    // yoTplSider
    // yoTplAccount
    // yoTplHeader
    // yoTplNavigation
    ...func_channel_macrocosm_yo_tpl,  // $DOC
    // ========================================= Yu
    /**
     * # 通道：更新
     *
     * <hr/>
     * @module yu/utter
     */
    ...func_channel_cm_yu_container_atom // $DOC
}