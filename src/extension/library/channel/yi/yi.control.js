import Ajax from '../../ajax';
import Fn from '../../functions';
import Ux from "ux";
import Cn from '../../channel';

/*
 * 1）controlId，UI_CONTROL 的 Id信息
 * 2）type，类型，LIST / FORM / COMPONENT
 * 3）webId，如果是 FORM 则是 formId，如果是 LIST 则是 listId
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
        const ajaxOp = Ajax.ops({control});
        const parser = Fn.parserOfButton(null);     // 这个操作可以 null 的引用
        return Ux.parallel([ajaxControl, ajaxOp], "config", "ops").then(response => {
            const {config = {}, ops = []} = response;
            return parser.parseOps(config, {type, ops}, true);
        }).catch(error => console.error(error));
    }
}

export default yiControl