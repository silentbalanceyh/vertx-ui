import __Zn from './zero.module.dependency';
import __LCT from './router.fn.to.location';

const isRoute = (props, prevProps) => {
    /*
     * 检查 $router 中的数据（特殊点在于 $router 不是 Object类型）
     */
    const $prevRouter = prevProps.$router;
    const $router = props.$router;
    if ($router && $prevRouter) {
        if ($router.path() !== $prevRouter.path()) {
            return true;
        }
        const current = $router.params();
        const original = $prevRouter.params();
        return __Zn.isDiff(current, original);
    } else return false;
};
const isLoaded = (props, prevProps) => !isRoute(props, prevProps);
const isAuthorized = (reference) => {
    if (0 === Object.keys(__Zn.isLogged()).length) {
        __LCT.toUnauthorized(reference);
    }
    return true;
};
export default {
    isLoaded,
    isRoute,
    isAuthorized,
}