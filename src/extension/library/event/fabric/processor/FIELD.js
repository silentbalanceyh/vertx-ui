export default {
    __DEFAULT__: (params = []) => async (dataEvent) => {
        const field = params[0];
        const prev = dataEvent.getPrev();
        if (prev && field) {
            return prev[field];
        } else {
            return null;
        }
    }
}