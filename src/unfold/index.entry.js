import func_ably_setting_yi from './ably.setting.fn.yi';
import func_ably_setting_yo from './ably.setting.fn.yo';
import func_ably_setting_yo_header from './ably.setting.fn.yo.pro.header';

import func_compile_pu_control from './compile.fn.pu.control';

import func_ego_use from './index.entry.ego';

export default {
    /**
     * # 通道：模板初始化
     * <hr/>
     * @module yi/unfold
     */
    ...func_ably_setting_yi,  // $DOC
    /**
     * # 通道：模板渲染
     * <hr/>
     * @module yo/unfold
     */
    ...func_ably_setting_yo,  // $DOC
    ...func_ably_setting_yo_header,// $DOC
    /**
     * # 通道：核心处理单元
     * <hr/>
     * @module pu/unfold
     */
    ...func_compile_pu_control,// $DOC
    /**
     * # 通道：内核标准接口
     *
     * kin = Kernel Interface Normalize
     * <hr/>
     * @module kin/unfold
     */
    ...func_ego_use,// $DOC
}