import Yi from './yi';
import Ix from '../../_internal/ix';
import Ux from "ux";

export default {
    /* 生命周期 constructor */
    ...Yi,
    yoValue: (reference, jsx = {}) => {
        const inputAttrs = Ux.valueLimit(jsx);
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
    },
    yoPager: Ix.tablePager,
    yoCombine: Ix.dialogCombine,
};