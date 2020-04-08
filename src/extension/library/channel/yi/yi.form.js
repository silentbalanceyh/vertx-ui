import Ux from 'ux';
import yiAssist from './yi.assist';

/**
 * ## 扩展函数
 *
 * 执行表单的初始化操作
 *
 * 1. arguments 长度为1，执行`capForm`初始化表单。
 * 2. `capForm` 会读取表单两次（静态和动态结合，合并生成最终配置）。
 * 3. 执行`configForm`配置计算`raft`的表单配置数据。
 *
 * @memberOf module:_channel
 * @method yiForm
 * @param {arguments} [arguments] 可选参数，变参
 * @returns {Promise<T>} 返回处理完成的表单配置
 */
function yiForm() {
    if (1 === arguments.length) {
        const reference = arguments[0];
        const state = {};
        let {
            config = {},
            $op = {},
        } = reference.props;
        // 内置拷贝相关信息保证不冲突
        config = Ux.clone(config);
        return Ux.capForm(reference, config).then(response => {
            const {form, addOn = {}} = response;
            state.raft = Ux.configForm(form, addOn);
            /*
             * 直接做权限过滤（二者执行权限过滤）
             */
            state.$op = $op;    // 绑定的Op
            return yiAssist(reference, state).then(Ux.ready);
        }).catch(error => {
            console.error(error);
        });
    }
}

export default yiForm