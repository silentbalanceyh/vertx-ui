import Ux from 'ux';

export default () => async (dataEvent) =>
    dataEvent.next(Ux.treeParent(dataEvent.getPrev(), dataEvent.getData()));