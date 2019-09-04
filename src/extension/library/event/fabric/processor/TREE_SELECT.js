import Ux from "ux";

const FUNS = {
    // 常用：当前节点 和 所有父节点
    PARENT_ALL_INCLUDE: (keys = [], data = []) =>
        keys.map(key => Ux.elementBranch(data, key))
            .reduce((previous, current) => previous.concat(current), [])
            .map(item => item.key),
    // 所有父节点
    PARENT_ALL: (keys = [], data = []) =>
        keys.map(key => Ux.elementBranch(data, key))
            .reduce((previous, current) => previous.concat(current), [])
            .map(item => item.key)
            .filter(item => !Ux.immutable(keys).contains(item)),
    // 直接父节点
    PARENT: (keys = [], data = []) =>
        keys.map(key => data.filter(each => key === each.key))
            .reduce((previous, current) => previous.concat(current), [])
            .map(item => item.parent),
    // 当前节点
    CURRENT: (keys = []) =>
        keys,
    // 直接子节点
    CHILDREN: (keys = [], data = []) =>
        keys.map(key => data.filter(each => key === each.key))
            .reduce((previous, current) => previous.concat(current), [])
            .map(item => data.filter(each => each.parent === item.key))
            .reduce((previous, current) => previous.concat(current), [])
            .map(item => item.key),
    // 所有子节点
    CHILDREN_ALL: (keys = [], data = []) =>
        keys.map(key => data.filter(each => key === each.key))
            .reduce((previous, current) => previous.concat(current), [])
            .map(item => Ux.elementChild(data, item))
            .reduce((previous, current) => previous.concat(current), [])
            .map(item => item.key),
    // 常用：当前节点 和 所有子节点
    CHILDREN_ALL_INCLUDE: (keys = [], data = []) =>
        keys.concat(keys.map(key => data.filter(each => key === each.key))
            .reduce((previous, current) => previous.concat(current), [])
            .map(item => Ux.elementChild(data, item))
            .reduce((previous, current) => previous.concat(current), [])
            .map(item => item.key)
        ),
};
export default {
    PARENT_ALL_INCLUDE: () => async (dataEvent) =>
        dataEvent.next(FUNS.PARENT_ALL_INCLUDE(dataEvent.getPrev(), dataEvent.getData())),
    PARENT_ALL: () => async (dataEvent) =>
        dataEvent.next(FUNS.PARENT_ALL(dataEvent.getPrev(), dataEvent.getData())),
    PARENT: () => async (dataEvent) =>
        dataEvent.next(FUNS.PARENT(dataEvent.getPrev(), dataEvent.getData())),
    CURRENT: () => async (dataEvent) =>
        dataEvent.next(FUNS.CURRENT(dataEvent.getPrev(), dataEvent.getData())),
    CHILDREN: () => async (dataEvent) =>
        dataEvent.next(FUNS.CHILDREN(dataEvent.getPrev(), dataEvent.getData())),
    CHILDREN_ALL: () => async (dataEvent) =>
        dataEvent.next(FUNS.CHILDREN_ALL(dataEvent.getPrev(), dataEvent.getData())),
    CHILDREN_ALL_INCLUDE: () => async (dataEvent) =>
        dataEvent.next(FUNS.CHILDREN_ALL_INCLUDE(dataEvent.getPrev(), dataEvent.getData())),
}