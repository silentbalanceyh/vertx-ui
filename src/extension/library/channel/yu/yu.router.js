import Ux from 'ux';
import U from 'underscore';

export default (reference, virtualRef, callback) => {
    if (U.isFunction(callback)) {
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
            callback();
        }
    } else {
        throw new Error("[ ExR ] 请传入 callback 第三参数，第三参数必须是一个合法的函数。");
    }
}