export default (params = []) => async (dataEvent) => {
    /*
     * 读取所有的 params
     */
    const prev = dataEvent.getPrev();
    let returnValue = null;
    for (let idx = 0; idx < params.length; idx++) {
        const field = params[idx];
        if (prev && field) {
            returnValue = prev[field];
        }
        if (returnValue) {
            break;
        }
    }
    return returnValue;
}