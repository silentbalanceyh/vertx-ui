import React from "react";
import {Icon} from "antd";
import Value from '../value';

const vtValue = (column = {}) => {
    if ("value" === column.dataIndex) {
        column.render = (text, record) => {
            if ("boolean" === record.type) {
                if (text) {
                    return (<span style={{
                        color: "#f66"
                    }}>true</span>)
                } else {
                    return (<span style={{
                        color: "#4169E1"
                    }}>false</span>)
                }
            } else if ("string" === record.type) {
                if ("this" === text) {
                    return (<span style={{
                        color: "#039"
                    }}>{text}</span>)
                } else {
                    return (<span style={{
                        color: "#87d068"
                    }}>{`"${text}"`}</span>)
                }
            } else if ("number" === record.type) {
                return (<span style={{
                    color: "#990"
                }}>{text}</span>)
            }
        }
    }
};
const vtValueByType = (column = {}) => {
    if ("value" === column.dataIndex) {
        column.render = (text, record) => {
            if ("String" === record.type) {
                text = `"${text}"`;
                return (<span style={{
                    color: "#87d068"
                }}>{text}</span>)
            } else if ("Boolean" === record.type) {
                return (<span style={{
                    color: "#4169E1"
                }}>{text}</span>)
            } else {
                return text;
            }
        }
    }
};
const vtNameOption = (column = {}) => {
    if ("name" === column.dataIndex || "option" === column.dataIndex) {
        column.render = (text, record) => {
            if ("reference" === text || "children" === text) {
                return (
                    <span style={{
                        color: "#9551f6"
                    }}>{text}</span>
                )
            } else {
                return "name" === column.dataIndex ? (
                    <span style={{
                        color: "E" === record.source ? "#c93" : "#1e358c"
                    }}>{text}</span>
                ) : (
                    <span style={{
                        color: "#4169E1"
                    }}>{text}</span>
                )
            }
        }
    }
};
const vtRequired = (column = {}) => {
    if ("required" === column.dataIndex) {
        column.render = (text) => {
            const type = text ? "check" : "close";
            const color = text ? "#F00" : "#69c";
            return <Icon type={type} style={{fontSize: 16, color}}/>;
        }
    }
};
const vtType = (column = {}) => {
    if ("type" === column.dataIndex) {
        column.render = (text) => (<span style={{
            color: "#bc0981"
        }}>{text}</span>)
    }
};
const COLOR = {
    "React.Component": "#bc0981",
    "React.Reference": "#66c",
    "Function": "#096",
    "Object": "#666",
    "HocI18n": "#06c"
};
const vtCategory = (column = {}) => {
    console.info(column);
    if ("category" === column.dataIndex) {
        column.render = (text) => {
            const color = COLOR[text];
            const style = {};
            if (color) style.color = color;
            console.info(style);
            return (<span style={style}>{text}</span>)
        }
    }
};
const SOURCE = {
    "R": "appstore,16,#6cf,React,来源于当前React组件、父组件等",
    "Z": "experiment,16,#f03,Zero,来源于@zero标记生成",
    "X": "deployment-unit,16,#639,Redux,来源于connect过后的结果",
    "S": "gold,16,#f93,State,来源于状态state定义",
    "J": "fork,16,#9c0,Json,直接来源于Json文件",
    "I": "download,16,#063,Import,直接来源于当前组件在import时的结果"
};
const vtSource = (column = {}, mapping) => {
    if ("source" === column.dataIndex) {
        column.render = (text) => {
            if (mapping) {
                // 旧版本兼容
                const item = mapping['source'][text];
                return (
                    <span><Icon {...item}/></span>
                )
            } else {
                const item = SOURCE[text];
                if ("string" === typeof item) {
                    const items = item.split(',');
                    const icon = {};
                    icon.type = items[0];
                    const style = {};
                    if (items[2]) style.color = items[2];
                    if (items[1]) style.fontSize = Value.valueInt(items[1]);
                    icon.style = style;
                    const text = items[3] ? items[3] : "";
                    return (<span style={style}>
                        <Icon {...icon}/>&nbsp;&nbsp;{text}
                    </span>)
                } else return false;
            }
        }
    }
};
export default {
    // dataIndex = value
    vtValue,
    vtValueByType,
    vtNameOption,
    vtRequired,
    vtType,
    vtSource,
    vtCategory,
}