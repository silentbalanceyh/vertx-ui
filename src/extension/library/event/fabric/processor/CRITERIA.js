export default {
    IN: (params = []) => async (dataEvent) => {
        const input = dataEvent.getPrev();
        const condition = {};
        if (0 < params.length) {
            condition[`${params[0]},i`] = input;
        }
        return condition;
    }
}