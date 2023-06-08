// -------------- 更新专用方法 -----------------
import Ux from "ux";
import __Yi from './channel.cm.fn.yi.container.atom';

const yuRouter = (reference, virtualRef, callbackFn) => {
    if (Ux.isFunction(callbackFn)) {
        /*
         * 当前和原始属性
         */
        const prevProps = virtualRef.props;
        const props = reference.props;
        /*
         * 检查 $router 中的数据（特殊点在于 $router 不是 Object类型）
         */
        const $prevRouter = prevProps.$router;
        const $router = props.$router;
        /*
         * 变化 params 时属于 $router 中的变化
         */
        const current = $router.params();
        const original = $prevRouter.params();
        if (Ux.isDiff(current, original)) {
            /*
             * 执行 callback
             */
            Ux.of(reference).readying().handle(() => {

                callbackFn();
            })
            // reference.?etState({$ready: false});
            // callbackFn();
        }
    } else {
        throw new Error("[ ExR ] 请传入 callback 第三参数，第三参数必须是一个合法的函数。");
    }
}
const yuContainer = (reference, virtualRef = {}) => {
    if (Ux.isRoute(reference.props, virtualRef.props)) {
        /*
         * 这行代码会引起闪屏的BUG
         * reference.setState({$ready: false});
         */
        __Yi.yiContainer(reference)
            .catch(error => console.error(error));
    }
};
export default {
    yuRouter,
    yuContainer,
}