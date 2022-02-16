import {Button, Modal, Table, Tag} from "antd";
import React from "react";
import Ux from 'ux';
import Ex from 'ex';
import Editor from '../ExEditorLink/UI';
import Op from './Op';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    renderLink: (reference) => {
        const {$action = {}} = reference.state;
        const {add = {}} = $action;
        const {text, ...rest} = add;
        return (
            <Button {...rest} onClick={event => {
                Ux.prevent(event);
                reference.setState({$visible: true})
            }}>{text}</Button>
        )
    },
    renderUnlink: (reference) => {
        const {$action = {}, $selected = []} = reference.state;
        const {remove = {}} = $action;
        const {text, ...rest} = remove;
        return (
            <Button {...rest} disabled={0 === $selected.length}
                    onClick={Op.rxUnlink(reference)}>
                {text}
            </Button>
        )
    },
    renderSave: (reference) => {
        const {$action = {}, $keyChange} = reference.state;
        const {save = {}} = $action;
        const {text, ...rest} = save;
        const {$mode} = reference.props;
        const disabled =
            (Ux.Env.FORM_MODE.EDIT !== $mode)
            || !$keyChange
        return (
            <Button {...rest} disabled={disabled}
                    onClick={Op.rxSave(reference)}>
                {text}
            </Button>
        )
    },
    renderTip: (reference) => {
        const info = Ux.fromHoc(reference, "info")
        return (
            <Tag style={{
                fontSize: 14
            }} color={"magenta"}>
                {info.tip}
            </Tag>
        )
    },
    renderWindow: (reference) => {
        const {
            $window = {},
            $visible = false,
            $editor = {},
        } = reference.state;
        const configWindow = Ux.clone($window);
        configWindow.visible = $visible;

        const inherit = Ex.yoAmbient(reference);
        inherit.config = $editor;
        // List / Form 才会使用
        const {$renders = {}} = reference.props;
        inherit.$renders = $renders;
        return (
            <Modal {...configWindow}>
                <Editor {...inherit} rxLink={Op.rxLink(reference)}/>
            </Modal>
        )
    },

    renderTable: (reference) => {
        let {$table = {}, $data = [], $loading = false, $selected = []} = reference.state;
        $table = Ux.clone($table);
        $table.rowSelection = {
            onChange: Ux.rxCheckedRow(reference),
            selectedRowKeys: $selected.map(selected => selected.key),
        }
        $table.columns = Ux.configColumn(reference, $table.columns);
        // 选中项设置
        const dataSource = Ux.clone($data);
        return (
            <Table {...$table}
                   dataSource={dataSource} loading={$loading}
                   className={"web-table"}/>
        )
    }
}