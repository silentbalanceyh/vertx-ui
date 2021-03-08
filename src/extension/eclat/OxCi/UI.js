import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import './Cab.less';
import {Col, Row, Tag} from 'antd';
import Jsx from './Web';
import JsxPage from "./Web.Page";
import Op from "./Op";

/**
 * ## 「组件」`OxCi`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|Ok|
 *
 * @memberOf module:web-component
 * @method OxCi
 */
// =====================================================
// componentInit/componentUp
// =====================================================

const toIdentifier = (reference, current = {}) => {
    if (current.identifier) {
        return current.identifier;
    } else {
        const {$identifier} = reference.props;
        return $identifier;
    }
};
const yiForm = (reference, state = {}) => {
    const {$index = 0, $stack = []} = state;
    const current = $stack[$index];
    if (current) {
        const identifier = toIdentifier(reference, current);
        const code = Ux.formatExpr("form.:identifier.view", {identifier});
        return Ux.ajaxGet('/api/ui/form/:code', {code}).then(response => {
            if (Ux.isEmpty(response)) {
                const error = Ux.fromHoc(reference, "error");
                state.failure = error.form;
            } else {
                let $raft = Ux.clone(response);
                /*
                 * 隐藏按钮
                 */
                $raft.ui.forEach(row => row.forEach(cell => {
                    if ((cell.field && "$button" === cell.field) ||
                        (cell.metadata && cell.metadata.startsWith("$button"))) {
                        cell.hidden = true;
                    }
                }));
                state.raft = $raft;
                state.$edition = false;
            }
            return Ux.promise(state);
        });
    }
};
const yiData = (reference, state = {}) => {
    const {$index = 0, $stack = []} = state;
    const current = $stack[$index];
    if (current) {
        const {key} = current;
        return Ux.ajaxGet('/api/ox/ci.device/:key', {key}).then(response => {
            state.$inited = response;
            /*
             * state.$identifier = 处理
             */
            const category = Ux.elementUniqueDatum(reference, "data.category",
                'key', response.categoryThird);
            // Fix: Unhandled Rejection (TypeError): Cannot read property 'identifier' of undefined
            if (category) {
                state.$identifier = category.identifier;
            }
            return Ux.promise(state);
        })
    }
};
const yiInit = (reference, state = {}) => yiForm(reference, state)
    .then(state => yiData(reference, state))

const yiDefinition = (reference, state = {}) => Ex.I.relation().then(definitions => {
    state.$definition = definitions;
    return Ux.promise(state);
});
const yiTab = (reference, state = {}) => {
    const config = Ux.fromHoc(reference, "tabs");
    const $tabs = Ux.configTab(reference, config);
    if (Ux.isArray($tabs.items)) {
        $tabs.items.forEach(item => {
            let fnRender = JsxPage[item.key];
            if (Ux.isFunction(fnRender)) {
                fnRender = fnRender(reference);
            }
            if (Ux.isFunction(fnRender)) {
                item.fnRender = fnRender;
            }
        });
    }
    $tabs.className = "ex-tabs";
    state.$tabs = $tabs;
    return Ux.promise(state);
};
const componentInit = (reference) => {
    const initState = {};
    /*
     * 堆栈初始化
     */
    initState.$stack = [];
    initState.$stack.push(Op.onStart(reference));
    initState.$index = 0;
    /*
     * 构造第一次请求
     */
    return yiTab(reference, initState)
        .then(state => yiInit(reference, state))
        .then(state => yiDefinition(reference, state))
        .then(Ux.ready).then(Ux.pipe(reference));
}
const componentUp = (reference, virtualRef) => {
    const $previous = virtualRef.state.$index;
    const $current = reference.state.$index;
    if (undefined !== $previous && undefined !== $current) {
        if ($previous !== $current) {
            reference.setState({$ready: false});
            let initState = reference.state;
            initState = Ux.clone(initState);
            yiInit(reference, initState).then(Ux.ready).then(Ux.pipe(reference))
        }
    }
}

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExCi")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {props: prevProps, state: prevState});
    }

    render() {
        const header = Ux.fromHoc(this, "header");
        return (
            <div className={"ox-ci"}>
                <Row className={"nav"}>
                    <Col span={2}>
                        <Tag color={"magenta"}>{header.stack}</Tag>
                    </Col>
                    <Col span={22}>
                        {Jsx.renderNav(this)}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {Ex.yoRender(this, () => {
                            return (
                                <div>
                                    {Jsx.renderPage(this)}
                                </div>
                            )
                        }, Ex.parserOfColor("OxCi").component())}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Component;