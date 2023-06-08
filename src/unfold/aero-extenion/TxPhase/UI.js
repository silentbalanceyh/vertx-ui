import React from 'react';
import Ux from 'ux';
import {Tag} from 'antd';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "TxPhase";
/*
 * Phase 和流程配置中的部分直接挂钩，不同流程Phase不同
 * {
 *     "phase": {
 *         "forbidden": [
 *         ]
 *     }
 * }
 * 该结构可描述工单状态，通过对工单状态的描述实现不同Phase的呈现效果
 * 其模式分为：
 * - LIST（列表模式）
 * - FORM（表单模式）
 *
 * 默认 Phase 如下：
 * - INIT，              填写申请
 * - DRAFT，             草稿
 * - PENDING，           等待处理
 * - FINISHED，          已完成
 * - ACCEPTED，          已接受
 * - REJECTED，          已拒绝
 * - REDO，              已驳回
 * - CANCELED，          已撤销
 * - EXPIRED，           已超时
 */
const componentYo = (reference) => {
    const configuration = Ux.fromHoc(reference, "config");
    const {config = {}} = reference.props;
    /*
     * {
     *     forbidden: [],
     *     addon: [],
     *     synonym: {}
     * }
     */
    const {source = [], error} = configuration;
    const {
        forbidden = [],
        addon = [],
        synonym = {}
    } = config;
    /*
     * 先追加以及解析
     * 1）source + addon
     * 2）解析结果（解析过程中带上synonym语义）
     * 3）解析禁用（解析过程中判断禁用处理）
     *
     * 解析表达式语法：
     * value,label:icon,iconSize:iconColor
     * 解析结果
     * {
     *     "value": "xxx",
     *     "label": "xxx",
     *     "icon": {
     *         "type": "xxx",
     *         "color": "xxx",
     *         "size": "xxx"
     *     }
     * }
     */
    const combine = source.concat(addon);
    const normalized = {};
    combine.forEach(expr => {
        let item = {};
        if ("string" === typeof expr) {
            const split = expr.split(",");
            // 索引1：键值
            item.key = split[0];
            item.value = split[0];
            // 索引2：显示文字
            const display = split[1] ? split[1] : "";
            const splitLabel = display.split(":");
            item.label = splitLabel[0];
            const icon = {style: {}};
            if (splitLabel[1]) {
                icon.type = splitLabel[1];
            }
            // 索引3：显示size和color
            if (icon.type && split[2]) {
                const splitIcon = split[2].split(":");
                icon.style.fontSize = splitIcon[0] ? Ux.valueInt(splitIcon[0]) : 16;
                if (splitIcon[1]) {
                    icon.style.color = splitIcon[1];
                }
                item.icon = icon;
            }
        } else if (Ux.isObject(expr)) {
            item = Ux.clone(expr);
            if (!item.value) item.value = item.key;
        }
        // forbidden
        if (item.key && !forbidden.includes(item.key)) {
            // synonym
            if (synonym.hasOwnProperty(item.key)) {
                const label = synonym[item.key];
                if (label) {
                    item.label = label;
                }
            }
            normalized[item.key] = item;
        }
    })
    /*
     * 分开渲染
     */
    const {value} = reference.props;
    const item = normalized[value];
    const inherit = {};
    if (item) {
        inherit.data = item;
        inherit.ready = true;
    } else {
        inherit.data = error;
        inherit.ready = false;
    }
    return inherit;
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {

    displayName = UCA_NAME;

    render() {
        const {value} = this.props;
        const inherit = componentYo(this);
        if (inherit.ready) {
            const item = Ux.clone(inherit.data);
            const {icon} = item;
            const attrTx = Sk.mixTx(UCA_NAME);
            return (
                <div {...attrTx}>
                    {icon ? Ux.v4Icon(icon) : false}
                    <span className={"label"}>{item.label}</span>
                </div>
            );
        } else {
            const error = Ux.clone(inherit.data);
            const format = Ux.formatExpr(error, {value});
            return (
                <div>
                    <Tag color={"red"} style={{fontSize: 14}}>
                        {format}
                    </Tag>
                </div>
            )
        }
    }
}

export default Component