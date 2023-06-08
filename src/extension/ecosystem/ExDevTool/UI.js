import React from 'react';

import Ux from 'ux';
import {Button, Tabs, Tooltip} from "antd";
import Rdr from './Web';

const UCA_NAME = "ExDevTool";
const toData = (reference, data = {}, spec, assist = false) => {
    const {comment = {}, key} = spec;
    const dataObj = data[key];
    let dataSource = dataObj ? Object.keys(dataObj).map(key => dataObj[key]) : []
    dataSource = dataSource.sort(Ux.sorterAscTFn('name'));
    dataSource.forEach(item => {
        if (comment[item.name]) {
            item.comment = comment[item.name];
        }
    });
    dataSource = dataSource.filter(item => {
        if (assist) {
            return item.name.startsWith("$a_");
        } else {
            return !item.name.startsWith("$a_");
        }
    })
    return dataSource;
}

const renderProp = (reference, data = {}, spec) => {
    const $spec = {
        ...spec,
        key: "props"
    }
    const dataSource = toData(reference, data, $spec)
    return Rdr.renderTable(reference, dataSource, $spec);
}

const renderState = (reference, data = {}, spec) => {
    const $spec = {
        ...spec,
        key: "state"
    }
    const dataSource = toData(reference, data, $spec)
    return Rdr.renderTable(reference, dataSource, $spec);
}
const renderAssist = (reference, data = {}, spec) => {
    const $spec = {
        ...spec,
        key: "assist"
    }
    const propsSource = toData(reference, data, {
        ...spec,
        key: "props"
    }, true)
    propsSource.forEach(item => item.source = "prop");
    const stateSource = toData(reference, data, {
        ...spec,
        key: "state"
    }, true)
    stateSource.forEach(item => item.source = "state");
    return Rdr.renderTable(reference, propsSource.concat(stateSource), $spec);
}

const RENDERS = {
    "keyProp": renderProp,
    "keyState": renderState,
    "keyAssist": renderAssist,
    "keyGraph": Rdr.renderGraph
}

const renderPage = (reference, data) => {
    const tabs = Ux.fromHoc(reference, "_tabs");
    const tabConfig = Ux.configTab(reference, tabs);
    const {items = [], ...rest} = tabConfig;
    // Comments
    const spec = Ux.fromHoc(reference, "spec");
    const comment = spec.comment;
    const commentAdd = {};
    comment.forEach(commentItem => {
        const kv = commentItem.split(',');
        commentAdd[kv[0]] = kv[1];
    })
    // v4
    const $items = Ux.v4Items(items, {
        // itemFn
        // childFn
        childFn: (item, ref) => {
            const renderFn = RENDERS[item.key];
            return Ux.isFunction(renderFn) ? renderFn(ref, data, {
                type: spec.type,
                comment: commentAdd,
            }) : false
        }
    }, reference);
    /*
            {items.map(item => {
                const renderFn = RENDERS[item.key];
                return (
                    <Tabs.?abPane {...item}>
                        {Ux.isFunction(renderFn) ? renderFn(reference, data, {
                            type: spec.type,
                            comment: commentAdd,
                        }) : false}
                    </Tabs.?abPane>
                )
            })}
     */
    return (
        <Tabs {...rest} className={"ux_tab"}
              tabBarExtraContent={renderTooltip(reference, data)}
              items={$items}/>
    )
}

const renderTooltip = (reference, each) => {
    const {props = {}, state = {}} = each;
    const turn = [];
    turn.push(props.hasOwnProperty("react"));
    turn.push(props.hasOwnProperty("reference"));
    turn.push(state.hasOwnProperty("$hoc"));
    turn.push(state.hasOwnProperty("$ready"));
    turn.push(state.hasOwnProperty("$submitting"));
    const mask = Ux.fromHoc(reference, "mask");
    return (
        <div className={"web-mark"}>
            {["apartment", "share-alt", "fire", "sync", "tool"].map((icon, index) => {
                const button = {};
                button.type = "primary";
                button.disabled = !turn[index];
                button.icon = icon;
                button.key = icon;
                return (
                    <Tooltip title={mask[icon]} key={button.key} placement={"left"}>
                        <Button {...button}/>
                    </Tooltip>
                )
            })}
        </div>
    )
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    render() {
        const data = Ux.DevTool(this).initialize();
        const items = Ux.v4Items(data, {
            itemFn: (each = {}) => {
                const item = {};
                const {name} = each;
                item.label = name;
                item.key = name;
                return item;
            },
            // childFn
            childFn: (each, ref) => renderPage(ref, each),
        }, this);
        /*
                {data.map(each => {
                    const {name} = each;
                    return (
                        <Tabs.?abPane tab={name} key={name}>
                            {renderPage(this, each)}
                        </Tabs.?abPane>
                    )
                })}
         */
        return (
            <Tabs tabPosition={"left"} type={"card"}
                  className={"web-develop-page"}
                  items={items}/>
        )
    }
}

export default Component