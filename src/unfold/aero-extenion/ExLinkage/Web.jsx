import {Button, Modal, Table, Tag} from "antd";
import React from "react";
import Ux from 'ux';
import __Zn from "../zero.aero.dependency";
import Editor from '../ExEditorLink/UI';
import Op from './Op';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    renderLink: (reference) => {
        const {$action = {}} = reference.state;
        const {add = {}} = $action;
        const {text, ...rest} = add;
        rest.icon = Ux.v4Icon(rest.icon);
        return (
            <Button {...rest} onClick={event => {
                Ux.prevent(event);
                Ux.of(reference).open().done();
                // reference.?etState({$visible: true})
            }}>{text}</Button>
        )
    },
    renderUnlink: (reference) => {
        const {$action = {}, $selected = []} = reference.state;
        const {remove = {}} = $action;
        const {text, ...rest} = remove;
        rest.icon = Ux.v4Icon(rest.icon);
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
        rest.icon = Ux.v4Icon(rest.icon);
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
        // open for $visible
        configWindow.open = $visible;

        const inherit = __Zn.yoAmbient(reference);
        inherit.config = $editor;
        // List / Form 才会使用
        const {$renders = {}} = reference.props;
        inherit.$renders = $renders;
        // 选择项
        {
            const {$data = []} = reference.state;
            const selectedData = [];
            $data.forEach(data => {
                const dataSelected = Ux.clone(data);
                if (dataSelected.__key) {
                    dataSelected.key = dataSelected.__key;
                }
                selectedData.push(dataSelected);
            })
            inherit.$selected = selectedData;
        }
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
        Ux.configScroll($table, $data, reference)
        return (
            <Table {...$table}
                   dataSource={dataSource} loading={$loading}
                   className={"ux_table"}/>
        )
    }
}