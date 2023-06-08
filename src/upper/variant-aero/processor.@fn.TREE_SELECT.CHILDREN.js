import Ux from 'ux';

export default () => async (dataEvent) =>
    dataEvent.next(Ux.treeChildren(dataEvent.getPrev(), dataEvent.getData()));