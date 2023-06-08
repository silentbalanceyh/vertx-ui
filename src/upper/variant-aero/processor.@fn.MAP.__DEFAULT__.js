import Ux from 'ux';

export default (params = []) => async (dataEvent) => {
    const input = dataEvent.getPrev();
    if (Ux.isArray(input)) {
        return input.map(item => {
            const field = params[0] ? params[0] : undefined;
            if (field) {
                return Ux.valuePath(item, field);
            } else {
                return item;
            }
        })
    } else {
        console.error("[ EvR ] 输入类型不对，必须是数组！", input);
    }
}