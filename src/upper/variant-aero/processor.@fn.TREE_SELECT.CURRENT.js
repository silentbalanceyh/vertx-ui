export default () => async (dataEvent) =>
    dataEvent.next(dataEvent.getPrev());