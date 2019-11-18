import Ux from "ux";

export default {
    PARENT_ALL_INCLUDE: () => async (dataEvent) =>
        dataEvent.next(Ux.treeParentAllIn(dataEvent.getPrev(), dataEvent.getData())),
    PARENT_ALL: () => async (dataEvent) =>
        dataEvent.next(Ux.treeParentAll(dataEvent.getPrev(), dataEvent.getData())),
    PARENT: () => async (dataEvent) =>
        dataEvent.next(Ux.treeParent(dataEvent.getPrev(), dataEvent.getData())),
    CURRENT: () => async (dataEvent) =>
        dataEvent.next(dataEvent.getPrev()),
    CHILDREN: () => async (dataEvent) =>
        dataEvent.next(Ux.treeChildren(dataEvent.getPrev(), dataEvent.getData())),
    CHILDREN_ALL: () => async (dataEvent) =>
        dataEvent.next(Ux.treeChildrenAll(dataEvent.getPrev(), dataEvent.getData())),
    CHILDREN_ALL_INCLUDE: () => async (dataEvent) =>
        dataEvent.next(Ux.treeChildrenAllIn(dataEvent.getPrev(), dataEvent.getData())),
}