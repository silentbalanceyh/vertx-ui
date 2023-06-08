import Ux from 'ux';

export default () => async (dataEvent) =>
    dataEvent.next(Ux.treeChildrenAll(dataEvent.getPrev(), dataEvent.getData()));