import Ux from "ux";
import {ExclamationCircleFilled} from '@ant-design/icons';
import React from "react";

/*
 * 执行状态处理
 * {
 *      "$data": [],
 *      "$treeMap": {
 *          "key": {
 *              "navigation": []
 *          }
 *      }
 * }
 */
const dataNorm = ($data = []) => {
    const state = {};
    state.$data = $data;
    const map = {};
    const source = Ux.clone($data);
    const yiNavItem = (dataItem) => {
        const result = {};
        result.key = dataItem.key;
        result.name = dataItem.name;
        return result;
    };
    $data.forEach(each => {
        const item = Ux.clone(each);
        if (0 < source.length) {
            const branch = Ux.elementBranch(source, item.key, "parentId");
            const navigation = map.navigation ? map.navigation : [];
            branch.forEach(each => navigation.push(yiNavItem(each)));
            item.navigation = navigation;
        } else {
            item.navigation = [yiNavItem(map)]
        }
        map[each.key] = item;
    });
    state.$treeMap = map;
    state.$visible = false;
    state.$submitting = false;
    return state;
}
const dataSelected = (reference, trash = false) => {
    const {
        $selectedKeys = [], $dataList = [],
        $treeMap = {}
    } = reference.state;
    let request = [];
    if (trash) {
        // 回收站选中
        const {$trash = []} = reference.state;
        request = $trash.filter(item => $selectedKeys.includes(item.key));
    } else {
        $selectedKeys.forEach(selected => {
            const item = $treeMap[selected];
            if (item) {
                request.push(item);
            } else {
                // 文件部分
                const found = Ux.elementUnique($dataList, 'key', selected);
                if (found) {
                    request.push(found);
                }
            }
        });
    }
    return request;
}
const dataPurge = (reference, info, fnSelected) => {
    const md = Ux.v4Modal()
    md.confirm({
        className: "ux_purge",
        content: info.confirm,
        icon: <ExclamationCircleFilled/>,
        onOk: () => {
            const request = fnSelected();
            // API接口：回收按钮，移动到回收站（批量）
            if (request && 0 < request.length) {
                Ux.ajaxDelete("/api/document/purge", request).then(purged => {
                    Ux.messageSuccess(info.success);
                    rxMixPurge(reference)(purged, {$selectedKeys: []})
                })
            }
        }
    })
}

const rxMixPurge = (reference) => (record = [], addOn) => {
    // 初始值
    const state = dataSync(reference, record, {
        ...addOn,
        removed: true,
    });
    // 修改 $trash（由于是 Purge，所以执行清空）
    const keys = record.map(each => each.key);
    state.$trash = state.$trash.filter(each => !keys.includes(each.key));
    // 更新状态
    Ux.of(reference).in(state).done();
    // reference.?etState(state);
}

const dataList = (reference, directory = {}, state = {}) => {
    const directoryId = directory.key;
    if (directoryId) {
        return Ux.ajaxGet("/api/document/by/directory", {directoryId}).then(response => {
            // 表格数据, 文件数据（验证重复性文件专用）
            state.$dataList = response;
            state.$dataLoading = false;
            return dataAuditor(response, state);
        });
    } else {
        console.warn("系统故障，不可读取目录信息，", directory);
        state.$dataList = [];
        state.$dataLoading = false;
        return Ux.promise(state);
    }
}
const dataAuditor = (response = [], state) => {
    const keys = response.map(each => each.createdBy)
        .filter(item => !!item);
    return Ux.ajaxPost("/api/user/search", {
        criteria: {
            "key,i": keys
        }
    }).then(response => {
        const user = Ux.valueArray(response);
        const grouped = Ux.elementMap(user, "key", "realname");
        if (state.$lazy) {
            Object.assign(state.$lazy, grouped);
        } else {
            state.$lazy = grouped;
        }
        return Ux.promise(state);
    })
}
const dataSearch = (reference, keyword, state = {}) => {
    if (keyword) {
        return Ux.ajaxGet("/api/document/by/keyword/:keyword", {keyword}).then(response => {
            state.$dataList = response;
            state.$dataLoading = false;
            return dataAuditor(response, state);
        })
    }
}
const dataSave = (reference, record, addOn) => {
    let {
        $data = [],             // 基础数据
        $dataList = [],         // 列表数据
    } = reference.state;
    $data = Ux.clone($data);
    $dataList = Ux.clone($dataList);
    // 记录的 keys 值
    const keys = Ux.isArray(record) ? record.map(each => each.key) : [record.key];

    Ux.itAmb(record, (item = {}) => {
        if (item.directory) {
            $data = Ux.elementSave($data, item);
        }
        $dataList = Ux.elementSave($dataList, item);
    })

    const updated = dataNorm($data);
    if (addOn) {
        Object.assign(updated, addOn);
    }
    updated.$dataList = $dataList;

    // 回收站计算（删除）
    let {$trash = []} = reference.state;
    $trash = Ux.clone($trash);
    $trash = $trash.filter(item => !keys.includes(item.key));
    updated.$trash = $trash;
    return updated;
}
const dataRemove = (reference, record = [], addOn) => {
    let {
        $data = [],             // 基础数据
        $dataList = [],         // 列表数据
    } = reference.state;
    $data = Ux.clone($data);
    $dataList = Ux.clone($dataList);
    // 移除的 keys 值
    const keys = Ux.isArray(record) ? record.map(each => each.key) : [record.key];
    $data = $data.filter(each => !keys.includes(each.key));
    $dataList = $dataList.filter(each => !keys.includes(each.key));
    // 状态合并
    const updated = dataNorm($data);
    if (addOn) {
        Object.assign(updated, addOn);
    }
    updated.$dataList = $dataList;

    let {$trash = []} = reference.state;
    // 回收站计算（新增）
    Ux.itAmb(record, item => $trash = Ux.elementSave($trash, item));
    updated.$trash = $trash;
    return updated;
}
const dataSync = (reference, record, addOn = {}) => {
    // 读取初始化数据
    let state = {};
    const {removed = false} = addOn;
    if (removed) {
        // 删除专用
        state = dataRemove(reference, record, addOn);
    } else {
        // 保存专用
        state = dataSave(reference, record, addOn);
    }
    // 状态计算
    return state;
}
export default {

    dataSelected,

    dataPurge,
    dataNorm,

    dataList,
    dataSearch,
    dataSync,
    dataAuditor,

    rxMixPurge,
}