export default () => async (dataEvent) => {
    const input = dataEvent.getPrev();
    return input[0];
};