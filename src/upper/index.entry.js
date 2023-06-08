import func_boundary_ui_container from './boundary.fn.ui.container';
import func_boundary_web_segment from './boundary.fn.web.segment'
import func_boundary_yl_channel_control from './boundary.fn.yl.channel.control';

import func_channel_commerce_yi_region from './channel.commerce.fn.yi.region';
import func_channel_commerce_yo_finance from './channel.commerce.fn.yo.finance';

import func_levy_out_economy from './levy.fn.out.economy';
import func_lkway_on_event from './lkway.fn.on.event';

import o_silver_bullet_designer from './o.silver.bullet.designer';
import o_silver_bullet_dialog from './o.silver.bullet.dialog';
import o_silver_bullet_form from './o.silver.bullet.form';
import o_silver_bullet_init from './o.silver.bullet.init';

import config_variant_op from './variant-op';
import config_variant_input from './variant-input';

import func_rbac_acl_action from './rbac.fn.acl.action';
import func_rbac_admit_region from './rbac.fn.acl.admit.region';
import func_rbac_child_execute from './rbac.fn.acl.child.execute';

import func_rbac_auth_remote_future from './rbac.fn.auth.remote.future';
// Areo
import areo_zero_index from './aero.zero.index';

export default {
    /**
     * # 扩展对接：UI组件
     *
     * <hr/>
     * @module ui/upper
     */
    ...func_boundary_ui_container, // $DOC
    /**
     * # 扩展对接：Web界面
     *
     * <hr/>
     * @module web/upper
     */
    ...func_boundary_web_segment, // $DOC
    /**
     * # 通道：复合组件
     *
     * <hr/>
     * @module yl/upper
     */
    ...func_boundary_yl_channel_control, // $DOC
    /**
     * # 通道：初始化
     *
     * <hr/>
     * @module yi/upper
     */
    ...func_channel_commerce_yi_region, // $DOC
    /**
     * # 通道：渲染
     *
     * <hr/>
     * @module yo/upper
     */
    ...func_channel_commerce_yo_finance,

    /**
     * # 扩展：数据标准化
     *
     * <hr/>
     * @module yo/upper
     */
    ...func_levy_out_economy,   // $DOC
    /**
     * # 扩展：事件
     *
     * <hr/>
     * @module on/upper
     */
    ...func_lkway_on_event,     // $DOC

    // High Order
    /**
     * # 扩展：高阶对象
     *
     * <hr/>
     * @module hoc/upper
     */
    ...o_silver_bullet_designer,    // $DOC
    ...o_silver_bullet_dialog,// $DOC
    ...o_silver_bullet_form,// $DOC
    ...o_silver_bullet_init,// $DOC

    // Configuration for Variant
    /**
     * # 扩展：OOB固化组件
     *
     * <hr/>
     * @module fixed/upper
     */
    ...config_variant_op,// $DOC
    ...config_variant_input,// $DOC

    /**
     * # 扩展：安全管理
     *
     * <hr/>
     * @module secure/upper
     */
    ...func_rbac_acl_action,// $DOC
    ...func_rbac_admit_region,// $DOC
    ...func_rbac_child_execute,// $DOC

    // RBAC
    ...func_rbac_auth_remote_future,// $DOC

    // 引擎核心
    ...areo_zero_index,// $DOC
}