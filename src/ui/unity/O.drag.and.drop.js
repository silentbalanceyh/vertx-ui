import Abs from '../abyss';

export default {
    /*
     * 用于绑定 targetSpec 中的 hover 方法
     * 直接设置 $hover
     */
    dndDropColor: (reference, isOver, additional) => {
        if (reference) {
            const state = reference.state ? reference.state : {};
            const isCall = Abs.isFunction(reference.props['rxDropOver']);
            if (isOver) {
                /*
                 * 悬停在上方的时候执行该操作
                 * 1. 第一次不悬停时执行
                 */
                const {$hover} = state;
                if (!$hover) {
                    const updateState = {$hover: true};
                    if (additional) Object.assign(updateState, additional);
                    reference.setState(updateState);
                    if (isCall) Abs.fn(reference)['rxDropOver']($hover, additional);
                }
            } else {
                /*
                 * 离开了 Drop 组件
                 */
                const {$hover} = state;
                if ($hover) {
                    const updateState = {$hover: false};
                    if (additional) Object.assign(updateState, additional);
                    reference.setState(updateState);
                    if (isCall) Abs.fn(reference)['rxDropOver']($hover, additional);
                }
            }
        } else {
            console.error("传入引用非法，请检查代码！", reference)
        }
    }
}