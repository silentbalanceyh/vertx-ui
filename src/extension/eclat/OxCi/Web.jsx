import {Breadcrumb, Tabs} from "antd";
import Op from "./Op";
import React from "react";
import Ex from "ex";
import {LoadingAlert} from "web";
import Ux from 'ux';
import {ExForm, ExRelation} from "ei";
import OxHistory from "../OxHistory/UI";
import OxTopology from "../OxTopology/UI";

class Component extends React.PureComponent {
    render() {
        const {data = {}, onClick} = this.props;
        return (
            <span>
                {/* eslint-disable-next-line */}
                <a href={"#"} onClick={onClick}>
                    {data.code}&nbsp;&nbsp;{Ux.v4Icon("search")}
                </a>
            </span>
        );
    }
}

const fnLink = (reference) => (props) => {
    props.onClick = (event) => {
        Ux.prevent(event);
        Op.onProbe(reference, props.data);
    };
    return (<Component {...props}/>);
}
const _toHeight = () => {
    const height = document.body.clientHeight;
    const maxHeight = height * 0.618;
    return {
        maxHeight,
        minHeight: maxHeight,
        overflowY: "auto",
        width: "100%",
        paddingRight: 16
    }
};

const tabDetail = reference => () => {
    const {raft, $edition, $inited = {}} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    inherit.config = {form: raft};
    inherit.$edition = $edition;
    inherit.$inited = $inited;
    return (
        <div style={_toHeight()}>
            <ExForm {...inherit}/>
        </div>
    );
};
const tabRelation = reference => () => {
    const {$definition, $inited = {}} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    if ($definition) {
        inherit.$definition = $definition;
    }

    const config = Ux.fromHoc(reference, "relation");
    const {category, ...rest} = config;
    const attrs = Ex.configRelation($inited, {category}, reference);
    attrs.config = Ux.clone(rest);
    attrs.$header = false;

    attrs.$renders = {
        sourceCode: fnLink(reference),
        targetCode: fnLink(reference),
    };

    Object.assign(inherit, attrs);
    return (
        <ExRelation {...inherit}/>
    );
};
const tabHistory = reference => () => {
    const {$inited = {}, $identifier} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    inherit.$inited = $inited;
    inherit.$identifier = $identifier;
    return (
        <div style={_toHeight()}>
            <OxHistory {...inherit}/>
        </div>
    );
};
const tabTopology = reference => (props = {}) => {
    const {$inited = {}, $identifier} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    inherit.$inited = $inited;
    inherit.$identifier = $identifier;
    if (props.$ciUNLOCK) {
        inherit.$ciUNLOCK = props.$ciUNLOCK;
    }
    /* 处理 $event 配置信息，到 topology 中去合并 */
    inherit.$container = 'web-g6-viewer-dialog';        // 切换图
    // 窗口固定宽度：1150
    inherit.$position = {
        start: {
            x: 152,
            y: 350
        },
        resize: false,    // 固定（一般用于窗口，不执行 resize
    }
    return (
        <div style={_toHeight()}>
            <OxTopology {...inherit} onNodeDoubleClick={Op.onVisit(reference)}/>
        </div>
    )
};
export default {
    renderNav: (reference) => {
        const {$stack = [], $index} = reference.state;
        return (
            <Breadcrumb separator={">"}>
                {$stack.map(item => {
                    let className;
                    if ($index === item.index) {
                        className = "nav-item nav-active"
                    } else {
                        className = "nav-item"
                    }
                    return (
                        <Breadcrumb.Item key={item.key} className={className}>
                            {/* eslint-disable-next-line */}
                            <a href={"#"} onClick={Op.onSelected(reference, item)}>{item.name}</a>
                        </Breadcrumb.Item>
                    )
                })}
            </Breadcrumb>
        )
    },
    renderPage: (reference, $ciUNLOCK) => {
        const inherit = Ex.yoAmbient(reference);
        inherit.$ciUNLOCK = $ciUNLOCK;
        const {$tabs = {}, failure} = reference.state;
        const {items = [], ...rest} = $tabs;
        // v4
        const $items = Ux.v4Items(items, {
            // itemFn: 取默认
            childFn: (item = {}) => {
                const {fnRender} = item;
                return Ux.isFunction(fnRender) ? fnRender(inherit) : false
            }
        }, reference);
        /*
                {items.map(item => {
                    const {fnRender, ...itemRest} = item;
                    return (
                        <Tabs.?abPane {...itemRest}>
                            {Ux.isFunction(fnRender) ? fnRender(inherit) : false}
                        </Tabs.?abPane>
                    )
                })}
         */
        return failure ? (
            <div style={{
                paddingTop: "10%",
                paddingLeft: "20%",
                paddingRight: "20%"
            }}>
                <LoadingAlert $alert={{
                    message: "Error",
                    description: [
                        failure
                    ]
                }} $icon={"stop"} $type={"error"}/>
            </div>
        ) : (
            <Tabs {...rest} items={$items}/>
        );
    },
    Page: {
        tabDetail,
        tabRelation,
        tabHistory,
        tabTopology
    }
}