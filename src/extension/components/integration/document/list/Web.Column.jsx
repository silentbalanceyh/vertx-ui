import Ux from "ux";
import {ExclamationCircleFilled} from '@ant-design/icons';
import {Divider, Dropdown, Menu, Popconfirm, Tooltip} from "antd";
import React from "react";
import Highlighter from "react-highlight-words";
import rxExecutor from './Op.UNLOCK';

const renderKeyword = (value, keyword, attrs = {}) => {
    return (
        <Highlighter
            highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
            searchWords={[keyword]}
            autoEscape
            textToHighlight={value}
            {...attrs}
        />
    )
}

const renderCreatedBy = (reference, config = {}) => (text) => {
    const {$lazy = {}, $highlight} = reference.props;
    const name = $lazy[text];
    if (name) {
        if ($highlight) {
            return renderKeyword(name, $highlight);
        } else {
            return (
                <span>{name}</span>
            )
        }
    } else {
        return (
            <span>{config.empty}</span>
        )
    }

}

const renderName = (reference) => (text, record) => {
    let img = Ux.Env.ICON_SYS.FILE;
    if (record.directory) {
        const visitMode = record.visitMode;
        if (visitMode.includes("x")) {
            img = Ux.Env.ICON_SYS.FOLDER;
        } else {
            img = Ux.Env.ICON_SYS.FOLDER_READONLY;
        }
    }
    const {$highlight} = reference.props;
    const attrs = {style: {}};
    attrs.style.overflow = "hidden";
    attrs.style.whiteSpace = "nowrap";
    attrs.style.textOverflow = "ellipsis";
    // Fix: https://github.com/silentbalanceyh/ox-engine/issues/1151
    attrs.style.maxWidth = 270;
    attrs.style.display = "inline-block";  // 必须有内容才会生效
    if ($highlight) {
        return (
            <span className={"cell-icon"}>
                <img src={img} alt={text}/>
                <Tooltip title={
                    <label className={"name-hint"}>
                        {renderKeyword(record['storePath'], $highlight)}
                    </label>
                }>
                    <label className={"name-title"} {...attrs}>
                        {renderKeyword(text, $highlight)}
                    </label>
                </Tooltip>
            </span>
        )
    } else {
        return (
            <span className={"cell-icon"}>
            <a href={""} onClick={event => Ux.prevent(event)} onDoubleClick={event => {
                Ux.prevent(event);
                Ux.fn(reference).rxNav(record);
            }}>
                <img src={img} alt={text}/>
            </a>
            <Tooltip title={record['storePath']}>
                <label {...attrs}>{text}</label>
            </Tooltip>
        </span>
        )
    }
}
const renderSize = (reference) => (text) => {
    if (text) {
        return Ux.toFileSize(text)
    } else {
        return "---"
    }
}

const renderDirDrop = (reference, config, record) => {
    const action = rxExecutor(reference, record);
    return (
        <Dropdown trigger={['hover']} overlay={
            <Menu>
                <Menu.Item>
                    <a {...Ux.toCssA(action.renameDir)}>
                        {Ux.v4Icon("edit")}&nbsp;{config.rename}
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a {...Ux.toCssA(action.remove)}>
                        {Ux.v4Icon("delete")}&nbsp;{config.remove}
                    </a>
                </Menu.Item>
            </Menu>
        }>
            <a {...Ux.toCssA()}>
                {config.more}
            </a>
        </Dropdown>
    );
}

const renderFileDrop = (reference, config, record) => {
    const action = rxExecutor(reference, record);
    return (
        <Dropdown trigger={['hover']} overlay={
            <Menu>
                <Menu.Item>
                    <a {...Ux.toCssA(action.renameFile)}>
                        {Ux.v4Icon("edit")}&nbsp;{config.rename}
                    </a>
                </Menu.Item>
                <Menu.Item>
                    <a {...Ux.toCssA(action.remove)}>
                        {Ux.v4Icon("delete")}&nbsp;{config.remove}
                    </a>
                </Menu.Item>
            </Menu>
        }>
            <a {...Ux.toCssA()}>
                {config.more}
            </a>
        </Dropdown>
    );
}
const renderActionDoc = (reference, config) => (text, record) => {
    const visitMode = record.visitMode;
    const edit = visitMode.includes("x");       // 目录的 x 权限
    const action = rxExecutor(reference, record);
    if (record.directory) {
        return (
            <span>
                <a {...Ux.toCssA(action.open)}>
                    {Ux.v4Icon("folder-open")}&nbsp;{config.open}
                </a>
                {edit ? (
                    <span>
                        <Divider type={"vertical"}/>
                        {renderDirDrop(reference, config, record)}
                    </span>
                ) : false}
            </span>
        );
    } else {
        return (
            <span>
                <a {...Ux.toCssA(action.download)}>
                    {Ux.v4Icon("download")}&nbsp;{config.download}
                </a>
                {edit ? (
                    <span>
                        <Divider type={"vertical"}/>
                        {renderFileDrop(reference, config, record)}
                    </span>
                ) : false}
            </span>
        );
    }
}
const renderActionTrash = (reference, config) => (text, record) => {
    const action = rxExecutor(reference, record);
    return (
        <span>
            <Popconfirm title={config.confirm}
                        overlayClassName={"ux-confirm-op"}
                        icon={<ExclamationCircleFilled/>}
                        onConfirm={action.purge}>
                <a {...Ux.toCssA()}>
                    {Ux.v4Icon("close")}&nbsp;{config.remove}
                </a>
            </Popconfirm>
            <Divider type={"vertical"}/>
            <a href={""} onClick={action.rollback}>
                {Ux.v4Icon("undo")}&nbsp;{config.back}
            </a>
        </span>
    );
}
export default {
    renderName,
    renderSize,
    renderCreatedBy,

    renderActionDoc,
    renderActionTrash,
}