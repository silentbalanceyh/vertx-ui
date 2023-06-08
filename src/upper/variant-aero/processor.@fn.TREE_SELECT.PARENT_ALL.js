import Ux from 'ux';

export default () => async (dataEvent) =>
    dataEvent.next(Ux.treeParentAll(dataEvent.getPrev(), dataEvent.getData()));