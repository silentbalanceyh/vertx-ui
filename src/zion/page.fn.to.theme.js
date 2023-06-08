import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;
const toCss = (name) => `${Cv['CSS_PREFIX']}-${name}`;
const toCssLogo = (reference) => {
    const {$collapsed = false} = reference.state;
    if ($collapsed) {
        return {
            width: 172,
            height: 38,
        }
    } else {
        return {
            width: 172,
            height: 38,
        }
    }
}
const toCssA = (callbackFn) => {
    const attrs = {};
    attrs.href = "";
    attrs.onClick = (event) => {
        __Zn.prevent(event);
        if (__Zn.isFunction(callbackFn)) {
            callbackFn();
        }
    }
    return attrs;
}
export default {
    toCss,
    toCssLogo,
    toCssA,
}