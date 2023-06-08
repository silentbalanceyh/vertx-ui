import Ex from "ex";
import Ux from "ux";
import React from 'react';
import OData from './Op.Data';

const yiPage = (reference) => {
    Ux.parallel([
        Ux.ajaxGet('/api/document/start/zero.directory'),   // 目录树
        Ux.ajaxGet('/api/document/by/trashed')
    ], "data", "trash").then((response = {}) => {
        const {data = [], trash = []} = response;
        const state = {};
        state.$ready = true;
        state.$trash = trash;
        const updated = OData.dataNorm(data);
        Object.assign(state, updated);
        return Ex.yiAssist(reference, state);
    }).then(Ux.ready).then(Ux.pipe(reference))
}
// -------------- 树选择
const rxTreeSelect = (reference) => (keys) => {
    const key = keys[0];
    doSelect(reference, key);
};
// -------------- 导航选择
const rxNavClick = (reference, item = {}) => (event) => {
    Ux.prevent(event);
    if (item.key) {
        doSelect(reference, item.key);
    }
}
const rxNavBack = (reference, navigation = []) => (event) => {
    Ux.prevent(event);
    const {$directory = {}} = reference.state;
    const current = $directory.key;
    if (current) {
        let backIndex = -1;
        navigation.forEach((nav, index) => {
            if (nav.key === current) {
                backIndex = index - 1;
            }
        })
        if (-1 !== backIndex) {
            const back = navigation[backIndex];
            if (back) {
                doSelect(reference, back.key);
            }
        }
    }
}
const doSelect = (reference, key) => {
    const {$treeMap = {}} = reference.state;
    const $directory = $treeMap[key];
    if ($directory) {
        /*
         * 上层处理数据执行下层刷新，重新处理 doSelect
         */
        // reference.?etState({$dataLoading: true});
        Ux.of(reference).in({$dataLoading: true}).handle(() => {
            const state = {};
            state.$directory = $directory;
            state.$keyword = undefined;
            state.$page = "DOCUMENT";
            state.$selectedKeys = [];
            OData.dataList(reference, $directory, state).then(Ux.pipe(reference));
        })
    }
}
const rxInputSearch = (reference) => ($keyword) => {
    // 搜索验证，过滤特殊符号
    const info = Ux.fromHoc(reference, "info");
    // 搜索有效
    if ($keyword) {
        const special = /[%#$<>:"/\\|?*\u0000-\u001F]/g;
        if (special.test($keyword)) {
            const {keyword = {}} = info;
            Ux.messageFailure(keyword.special);
        } else {
            // reference.?etState({$dataLoading: true});
            Ux.of(reference).in({$dataLoading: true}).handle(() => {
                const state = {};
                state.$selectedKeys = [];
                state.$keyword = $keyword;
                state.$page = "DOCUMENT";
                OData.dataSearch(reference, $keyword, state).then(Ux.pipe(reference));
            })
        }
    } else {
        // 搜索无效
        const {$directory = {}} = reference.state;
        doSelect(reference, $directory.key);
    }
}

const rxMixTrash = (reference) => (record = [], addOn) => {
    // 初始化状态
    const state = OData.dataSync(reference, record, {
        ...addOn,
        removed: true,
    });
    // 更新状态
    Ux.of(reference).in(state).done();
    // reference.?etState(state);
}
const rxMixRollback = (reference) => (record = [], addOn) => {
    // 初始化状态
    const state = OData.dataSync(reference, record, addOn);
    // 更新状态
    Ux.of(reference).in(state).done();
    // reference.?etState(state);
}
export default {
    yiPage,
    rxTreeSelect,                           // 菜单选择
    rxNavClick,                             // 导航点击
    rxNavBack,                              // 返回上一级
    rxInputSearch,                          // 搜索按钮

    Form: {
        rxAdd: (reference) => (record = {}) => {
            // 初始化状态
            const state = OData.dataSync(reference, record);
            // 更新状态
            let response = [];
            if (Ux.isArray(record)) {
                response = record;
            } else {
                response = [record];
            }
            const {$lazy = {}} = reference.state;
            state.$lazy = $lazy;
            OData.dataAuditor(response, state).then(Ux.pipe(reference));
        },
        rxEdit: (reference) => (record = {}) => {
            // 内置处理（关闭）
            const state = {};
            state.$submitting = false;
            state.$visible = false;

            // 表单初始数据重置（还需更改 $data 数组）
            state.$inited = undefined;
            const {$data = []} = reference.state;
            state.$data = Ux.elementSave($data, record);

            // 上层执行
            Ux.fn(reference).rxMixRename(record);

            // 更新状态
            Ux.of(reference).in(state).done();
            // reference.?etState(state);
        }
    },

    // List继承专用方法
    List: {
        // 选中列表
        rxRowSelect: (reference) => ($selectedKeys = []) => {
            Ux.of(reference).in({$selectedKeys}).done();
            // reference.?etState({$selectedKeys});
        },


        // 「目录专用」打开目录专用方法
        rxNav: (reference) => (item = {}) => rxNavClick(reference, item)(),


        // 永久删除
        rxMixPurge: (reference) => OData.rxMixPurge(reference),


        // 还原
        rxMixRollback,


        // 重命名
        rxMixRename: (reference) => (record = {}) => {
            // 初始化状态
            const state = OData.dataSync(reference, record);
            // 更新状态
            Ux.of(reference).in(state).done();
            // reference.?etState(state);
        },


        // 删除
        rxMixTrash
    },

    rxToolbar: (reference) => {
        const info = Ux.fromHoc(reference, "info");
        return {
            // 新建目录
            folder: () => Ux.of(reference).in({
                $window: "add"
            }).open().done(),
            // reference.?etState({$visible: true, $window: "add"})
            // 上传文件
            upload: () => Ux.of(reference).in({
                $window: "upload"
            }).open().done(),
            // reference.?etState({$visible: true, $window: "upload"})
            // 回收
            remove: () => {
                const {trash = {}} = info;
                const md = Ux.v4Modal()
                md.confirm({
                    content: trash.confirm,
                    onOk: () => {
                        const request = OData.dataSelected(reference);
                        // API接口：回收按钮，移动到回收站（批量）
                        Ux.ajaxDelete("/api/document/trash", request).then(removed => {
                            Ux.messageSuccess(trash.success);


                            // 二阶函数调用
                            rxMixTrash(reference)(removed, {$selectedKeys: []})
                        })
                    }
                })
            },
            // 永久删除：
            purgeOn: () => {
                const info = Ux.fromHoc(reference, "info");
                OData.dataPurge(reference, info.purge, () => OData.dataSelected(reference, true));
            },
            // 清空回收站
            purge: () => {
                const info = Ux.fromHoc(reference, "info");
                OData.dataPurge(reference, info.clean, () => {
                    const {$trash = []} = reference.state;
                    return Ux.clone($trash);
                });
            },
            // 还原
            rollback: () => {
                const request = OData.dataSelected(reference, true);
                // API接口：还原按钮，从回收站中还原
                Ux.ajaxPut("/api/document/rollback", request).then(rollback => {
                    Ux.messageSuccess(info.rollback);


                    // 二阶函数调用
                    rxMixRollback(reference)(rollback, {$selectedKeys: []});
                })
            },
            trash: (event) => {
                // 回收站
                Ux.prevent(event);
                Ux.of(reference).in({
                    $directory: undefined,       // 选择的目录
                    $selectedKeys: [],           // 清空选择项
                    $page: "TRASH"
                }).done()
                // reference.?etState({
                //     $directory: undefined,       // 选择的目录
                //     $selectedKeys: [],           // 清空选择项
                //     $page: "TRASH"
                // })
            }
        }
    }
}