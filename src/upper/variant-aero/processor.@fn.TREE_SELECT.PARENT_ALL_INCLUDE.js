import Ux from 'ux';

export default () => async (dataEvent) =>
    dataEvent.next(Ux.treeParentAllIn(dataEvent.getPrev(), dataEvent.getData()));