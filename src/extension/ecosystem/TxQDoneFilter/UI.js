import React from 'react';
import {Col, Row} from "antd";
import Ux from "ux";
import Ex from 'ex';
import './Cab.less';

const doQuery = (reference, state = {}) => {
    const {rxQuery} = reference.props;
    const $condition = [];
    if (Ux.isFunction(rxQuery)) {
        const {$view = [], $connector = "OR"} = state;
        const criteria = {};
        const user = Ux.isLogged();
        /*
         * $connector 连接符
         */
        criteria[""] = ("AND" === $connector);


        /*
         * $view
         */
        $view.forEach(field => criteria[field] = user.key);
        rxQuery(criteria);
        return $condition;
    }
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("TxQDoneFilter")
    .to()
)
class Component extends React.PureComponent {
    state = {
        $view: [],
        $connector: "AND",
        $keys: [],
    };

    componentDidMount() {
        Ex.yiAssist(this).then(Ux.ready).then(Ux.pipe(this))
    }

    render() {
        return Ex.yoRender(this, () => {
            const config = Ux.fromHoc(this, "toolbar");
            const exchange = Ux.Env.GRID.LIST_TT;
            const wf = Ex.wf(this);
            return (
                <div className={"ex-flow-filter"}>
                    <Row>
                        <Col {...exchange.open}>
                            {wf.Jsx.qrLabel(config)}
                        </Col>
                        <Col {...exchange.batch}>
                            {wf.Jsx.qrSelected(config, doQuery)}
                        </Col>
                        <Col {...exchange.search}>
                            {wf.Jsx.qrInView(config, doQuery)}
                        </Col>
                        <Col {...exchange.extra}>
                            {wf.Jsx.qrInOpr(config, doQuery)}
                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("TxQDoneFilter").view())
    }
}

export default Component