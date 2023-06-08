import React from 'react';
import Ex from "ex";
import Ux from "ux";
import {Col, Row} from "antd";
import Rdr from './Web';
import Sk from 'skin';
import __ from './Cab.module.scss';

const componentInit = (reference) => {
    Ex.yiAssist(reference).then(state => {
        const {$app} = reference.props;
        const sigma = $app._("sigma");
        const user = Ux.isLogged();
        Ux.ajaxPost("/api/up/flow-queue", {
            criteria: {
                "": true,
                sigma,
                acceptedBy: user.key,
            },
            pager: {
                page: 1,
                size: 10
            }
        }).then(response => {
            const $data = Ux.valueArray(response);
            let table = Ux.fromHoc(reference, "table");
            const columns = Ux.configColumn(reference, table.columns);
            return Ux.ajaxEager(reference, columns, $data).then($lazy => {
                state.$data = $data;
                state.$lazy = $lazy;
                return Ux.promise(state);
            })
        }).then(state => Ux.promise({all: 0, pending: 0, finished: 0}).then(( processed = {}) => {
            const { $data = []} = processed;
            const staData = {all: $data.length, pending: 0, finished: 0};
            $data.forEach( temp => {
                if (temp['active'] === true) {
                    staData['pending']++;
                } else {
                    staData['finished']++;
                }
            })

            // console.log(staData);
            const statistic = [];
            const dim = Ux.fromHoc(reference, "dim");
            dim.statistic.forEach(each => {
                const split = each.split(',');
                const item = {};
                item.key = split[0];
                item.title = split[1];
                item.icon = split[2];
                item.color = split[3];
                item.value = staData[item.key];
                statistic.push(item);
            });
            state.$statistic = statistic;
            return Ux.promise(state);
        })).then(state => Ux.promise({
            // TODO: 统计专用，按服务目录统计
            "w.supervise.request": 12,
            "w.asset.income": 5,
            "w.employee.trip": 2,
            "w.asset.outcome": 11,
            "w.continuity.request": 21,
            "w.employee.assignment": 2,
            "w.vendor.check-out": 3,
            "w.asset.discard": 12,
            "w.vendor.assessment": 30,
        }).then((data = {}) => {
            /*
             * 维度计算（按服务目录统计数量）
             * pending, finished
             */
            const catalog = Ux.onDatum({state}, "service.catalog");
            const graph = {data: [], config: {}};
            catalog.filter(each => undefined !== data[each.code]).forEach(each => {
                const item = {};
                item.key = each.code;
                item.name = each.name;
                item.value = data[each.code] ? data[each.code] : 0;
                graph.data.push(item);
            })
            state.$graph = graph
            return Ux.promise(state);
        })).then(Ux.ready).then(Ux.pipe(reference))
    });
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this)
    }

    render() {
        return Ex.ylCard(this, () => {
            const inherit = Ex.yoAmbient(this);
            inherit.config = {};
            const attrPage = Sk.mix(__.upg_todo_pending);
            return (
                <div {...attrPage}>
                    <Row>
                        {/*<Col span={4}>*/}
                        {/*    <ExAccount/>*/}
                        {/*</Col>*/}
                        <Col span={24} className={"statistic"}>
                            <Row>
                                {Rdr.renderStatistic(this)}
                            </Row>
                            <Row>
                                <br/>
                            </Row>
                            {/*<Row className={"g2-bar"}>*/}
                            {/*    <Col span={24}>*/}
                            {/*        {Rdr.renderBar(this)}*/}
                            {/*    </Col>*/}
                            {/*</Row>*/}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            {Rdr.renderTable(this)}
                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("PxPending").page());
    }
}

export default Component