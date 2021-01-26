import Ux from 'ux';
import {Fn} from './I.list.options';
/*
 * 启用 / 禁用状态处理
 */
export default (reference, {
    items = [], // 总的 items
    index = 0,  // 当前 item的索引
    item,       // 当前 item
}) => {
    if (item) {
        const {options = {}} = reference.state;
        /* 打开Tab页的限制，默认是1 */
        let counter = 1;
        if (options.hasOwnProperty(Fn.Opt.TABS_COUNT)) {
            counter = Ux.valueInt(options[Fn.Opt.TABS_COUNT], 1);
        }
        /*
        * 如果 length = ( counter + 1 )
        * 则禁用 index = 0 的首页签
        * */
        if (counter <= (items.length - 1)) {
            /*
             * 禁用第一页（如果打开页码超过上限，那么直接禁用第一页，防止再打开新的页签
             */
            item.disabled = (0 === index);
        }
        /*
         * 强制打开最后剩余的一页
         */
        if (1 === items.length && 0 === index) {
            item.disabled = false;
        }
        return item;
    }
}