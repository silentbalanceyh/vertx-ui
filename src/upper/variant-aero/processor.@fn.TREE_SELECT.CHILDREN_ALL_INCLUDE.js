import Ux from 'ux';

export default () => async (dataEvent) =>
    dataEvent.next(Ux.treeChildrenAllIn(dataEvent.getPrev(), dataEvent.getData()));