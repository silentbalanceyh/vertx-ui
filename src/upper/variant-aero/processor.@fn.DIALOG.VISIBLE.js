export default (params = []) => async (dataEvent) => {
    const normalized = {};
    normalized.$visible = true;
    normalized.$current = dataEvent.getPrev();
    return normalized;
};