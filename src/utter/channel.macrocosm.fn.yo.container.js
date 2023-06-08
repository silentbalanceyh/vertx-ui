import Ux from 'ux';
import yoAmbient from './channel.@fn.yo.ambient';
import __V from './pedestal.v.constant.option';

const yoTabPage = (reference, {
    items = [],           // 总的 items
    index = 0,          // 当前 item的索引
    item,                // 当前 item
}) => {
    if (item) {
        const {options = {}} = reference.state;
        /* 打开Tab页的限制，默认是1 */
        let counter = 1;
        if (options.hasOwnProperty(__V.Opt.TABS_COUNT)) {
            counter = Ux.valueInt(options[__V.Opt.TABS_COUNT], 1);
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

const yoDialog = (reference, dialog = {}) => {
    const {
        $visible = false,
        $submitting = false,
    } = reference.state;
    // v4
    dialog.open = $visible;
    dialog.confirmLoading = $submitting;
    dialog.cancelButtonProps = {
        loading: $submitting
    };
    // 内容修正
    const child = yoAmbient(reference);
    /*
     * 这两个连接函数防止内层调用引起连接问题
     */
    child.rxClose = (event) => {
        Ux.prevent(event);
        Ux.of(reference).hide().load().done();
    };
    // 防止穿透的执行效果处理，该方法在此处不能继承。
    child.rxSubmitting = Ux.rxSubmitting(reference, true)
    // 解决无法捕捉 form 的专用 BUG，由于此处出现了打断，
    // ExView 部分什么都不做
    return child;
}
export default {
    yoTabPage,
    yoDialog,
}