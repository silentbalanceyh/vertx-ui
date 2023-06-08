export default (params = []) => async (dataEvent) => {
    const input = dataEvent.getPrev();
    const expression = params[0];
    if (expression) {
        const next = {};
        const kv = expression.split('`');
        kv.forEach(each => {
            const indexFields = each.split('=');
            const index = indexFields[0];
            const field = indexFields[1];
            if (index && field) {
                const value = input[index];
                if (value) {
                    next[field] = value;
                }
            }
        });
        return next;
    } else {
        console.error("[ EvR ] 表达式缺乏！", params);
    }
}