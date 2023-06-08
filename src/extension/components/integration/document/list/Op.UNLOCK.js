import Ux from "ux";
import React from "react";
import {saveAs} from "file-saver";

export default (reference, record) => {
    const info = Ux.fromHoc(reference, "info");
    return ({
        // 重命名文件
        renameFile: () => {
            const state = {};
            state.$visible = true;
            const {$directory = {}} = reference.props;
            const $inited = Ux.clone(record);
            $inited.storeParent = $directory['storePath'];
            state.$inited = $inited;
            state.$window = "renameFile";
            Ux.of(reference).in(state).done();
            // reference.?etState(state);
        },
        // 打开目录
        open: () => Ux.fn(reference).rxNav(record),
        // 下载文件
        download: () => Ux.ajaxDownload("/api/file/download/:key", record)
            .then(data => saveAs(data, record.name)),
        // 重命名
        renameDir: () => {
            const state = {};
            state.$visible = true;
            const {$directory = {}} = reference.props;
            const $inited = Ux.clone(record);
            $inited.storeParent = $directory['storePath'];
            state.$inited = $inited;
            state.$window = "renameDir";
            Ux.of(reference).in(state).done();
            // reference.?etState(state);
        },
        rollback: (event) => {
            Ux.prevent(event);
            // reference.?etState({$spinning: true});
            Ux.of(reference).spinning().handle(() => {
                const request = [record];
                // API接口：还原链接，从回收站中还原
                Ux.ajaxPut("/api/document/rollback", request).then(rollback => {
                    Ux.messageSuccess(info.rollback);
                    let {$selectedKeys = []} = reference.props;
                    if ($selectedKeys.includes(record.key)) {
                        $selectedKeys = $selectedKeys.filter(item => item !== record.key);
                    }
                    Ux.fn(reference).rxMixRollback(rollback, {$selectedKeys});
                    Ux.of(reference).spun().done();
                    // reference.?etState({$spinning: false});
                })
            })

        },
        // 永久删除
        purge: (event) => {
            Ux.prevent(event);
            // API接口：删除链接，从回收站中彻底删除
            const request = [record];
            Ux.ajaxDelete("/api/document/purge", request).then(purge => {
                Ux.messageSuccess(info.purge);
                let {$selectedKeys = []} = reference.props;
                if ($selectedKeys.includes(record.key)) {
                    $selectedKeys = $selectedKeys.filter(item => item !== record.key);
                }
                Ux.fn(reference).rxMixPurge(purge, {$selectedKeys});
            })
        },
        // 移动到回收站
        remove: () => {
            const content = record.directory ? info.dir : info.file;
            const md = Ux.v4Modal()
            md.confirm({
                content,
                // Default Event Will trigger
                onOk: () => {
                    // API接口：回收链接，移动到回收站（批量）
                    const request = [record];
                    Ux.ajaxDelete("/api/document/trash", request).then(removed => {
                        // Delete successfully
                        Ux.messageSuccess(info.finished);
                        let {$selectedKeys = []} = reference.props;
                        if ($selectedKeys.includes(record.key)) {
                            $selectedKeys = $selectedKeys.filter(item => item !== record.key);
                        }
                        Ux.fn(reference).rxMixTrash(removed, {$selectedKeys});
                    })
                }
            })
        }
    })
}