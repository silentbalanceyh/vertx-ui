import Ajax from '../../ajax';
import Fn from '../../functions';
import Ux from "ux";
import Cn from '../../channel';

/*
 * 1）controlId，UI_CONTROL 的 Id信息
 * 2）type，类型，LIST / FORM / COMPONENT
 * 3）webId，如果是 FORM 则是 formId，如果是 LIST 则是 listId
 */
/**
 * ## 扩展函数
 *
 * 控件专用处理，从后端读取配置：UI_CONTROL / UI_FORM / UI_LIST
 *
 * 1. 单参，直接提取控件配置。
 * 2. 多参，根据`control`和类型`type`执行控件配置提取（包括Form和List）。
 *
 * @memberOf module:_channel
 * @method yiControl
 * @param {arguments} [arguments] 可选参数，变参
 * @returns {Promise<T>} 返回最终的 Promise。
 */
function yiControl() {
    if (1 === arguments.length) {
        const control = arguments[0];
        const config = Cn.yoControl(control);
        return Ux.promise(config);
    } else {
        const control = arguments[0];
        const type = arguments[1];
        /*
         * 合并处理，得到最终的 control 级别的配置
         */
        const ajaxControl = Ajax.control({type, control});
        const ajaxOp = Ajax.ops({control, type: "OP"});
        const parser = Fn.parserOfButton(null);     // 这个操作可以 null 的引用
        return Ux.parallel([ajaxControl, ajaxOp], "config", "ops").then(response => {
            const {config = {}, ops = []} = response;
            /*
             * 操作专用 __acl 处理
             */
            if ("LIST" === type) {
                Ux.aclOp(config.options, ops);
            }
            return parser.parseOps(config, {type, ops}, true);
        }).catch(console.error);
    }
}

export default yiControl