import Ux from "ux";
import {Modal} from "antd";
import Ex from "ex";
import Op from "../Op";
import React from "react";

import FormDirAdd from "./UI.Dir.Add";
import FormDirRename from "./UI.Dir.Rename";
import FormFileUpload from './UI.File.Upload';
import FormFileRename from './UI.File.Rename';

const renderDirAdd = (reference) => {
    const window = Ux.fromHoc(reference, "window");
    const {
        $visible = false,
        $window,
    } = reference.state;
    const dialog = Ux.configDialog(reference, window[$window]);
    return (
        <Modal {...dialog} open={$visible}>
            {(() => {
                if ("add" === $window) {
                    // 新建
                    const inherit = Ex.yoAmbient(reference);
                    const {$directory} = reference.state;
                    /*
                     * 添加专用 values
                     */
                    const values = Ux.valueOk($directory, [
                        "language",
                        "type",
                        "category",
                        "visit",
                        "visitRole",
                        "visitGroup"
                    ]);
                    values.parentId = $directory['directoryId'];
                    values.storeParent = $directory['storePath'];

                    inherit.$inited = values;
                    inherit.$mode = Ux.Env.FORM_MODE.ADD;
                    /*
                     * 提交函数：防止上层继承，需单独提出来执行
                     */
                    inherit.rxClose = Op.Form.rxAdd(reference);
                    return (<FormDirAdd {...inherit}/>)
                } else {
                    const inherit = Ex.yoAmbient(reference);
                    const {
                        $directory,
                        $dataList = []
                    } = reference.state;
                    // 上传
                    inherit.$directory = $directory;
                    inherit.rxClose = Op.Form.rxAdd(reference);
                    inherit.$files = $dataList.filter(each => !each.directory);
                    return (<FormFileUpload {...inherit}/>);
                }
            })()}
        </Modal>
    )
}
const renderEdit = (reference) => {
    const window = Ux.fromHoc(reference, "window");
    const {
        $visible = false,
        $window = "renameDir"
    } = reference.state;
    const dialog = Ux.configDialog(reference, window[$window]);
    return (
        <Modal {...dialog} open={$visible}>
            {(() => {
                // 新建
                const inherit = Ex.yoAmbient(reference);
                const {$inited} = reference.state;

                inherit.$inited = $inited;
                inherit.$mode = Ux.Env.FORM_MODE.EDIT;
                /*
                 * 提交函数：防止上层继承，需单独提出来执行
                 */
                inherit.rxClose = Op.Form.rxEdit(reference);
                if ("renameDir" === $window) {
                    return (<FormDirRename {...inherit}/>)
                } else {
                    return (<FormFileRename {...inherit}/>)
                }
            })()}
        </Modal>
    )
}
export default {
    renderDirAdd,
    renderEdit,
}