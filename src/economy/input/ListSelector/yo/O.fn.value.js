import Ux from "ux";

export default (reference, jsx = {}) => {
    const inputAttrs = Ux.valueFlip(jsx);
    if (undefined === inputAttrs.value) {
        /*
         * 只有 undefined 的时候触发
         */
        const {$defaultValue} = reference.state;
        if ($defaultValue) {
            inputAttrs.value = $defaultValue;
        }
    }
    return inputAttrs;
}