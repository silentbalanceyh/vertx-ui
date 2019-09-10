import Ux from 'ux';

export default {
    LITERAL: () => async (dataEvent) => {
        const input = dataEvent.getPrev();
        return input[0];
    },
    __DEFAULT__: (params) => async (dataEvent) => {
        const input = dataEvent.getPrev();
        if (1 >= input.length) {
            const result = input[0];
            if (result) {
                const path = params[0];
                if (path) {
                    return Ux.valuePath(result, path);
                } else {
                    /*
                     * 没有配置任何参数，直接返回唯一对象
                     */
                    return result;
                }
            } else {
                /*
                 * 长度为0，直接返回 undefined
                 */
                return null;
            }
        } else {
            console.error("[ EvR ] 过滤过后的长度不对！", input);
        }
    }
}