import React from 'react';
import Ex from "ex";
import Ux from "ux";
import {Col, Row} from "antd";
import Rdr from './Web';
import Sk from 'skin';
import __ from "./Cab.module.scss";

const renderRegion = (reference, configKey, renderFn) => {
    const regionData = Ux.fromHoc(reference, "region");
    return (
        <Col span={12} className={"region"} key={configKey}>
            <Row className={"ux_title"}>{regionData[configKey]}</Row>
            <Row className={"chart"}>
                <Col span={24}>
                    {renderFn(reference)}
                </Col>
            </Row>
        </Col>
    )
}
const componentInit = (reference) => {
    Ex.yiAssist(reference).then(state => {
        const {$app} = reference.props;
        const sigma = $app._("sigma");
        state.$loginUser = Ux.isLogged();
        Ux.ajaxPost("/api/xc/ci.device/search").then(response => {
            state.$cidevice = Ux.valueArray(response);
            return Ux.promise(state);
        }).then(state => {
            const usedata = {};
            const assData = {};
            state.$cidevice.forEach(citemp => {
                // 使用人
                if (citemp['userId'] === state.$loginUser['workNumber']) {
                    let useNum = usedata[citemp['categoryThird']] ? usedata[citemp['categoryThird']] : 0;
                    useNum += 1;
                    usedata[citemp['categoryThird']] = useNum;
                }
                if (citemp['ownerId'] === state.$loginUser['workNumber']) {
                    let assigneNum = assData[citemp['categoryThird']] ? assData[citemp['categoryThird']] : 0;
                    assigneNum += 1;
                    assData[citemp['categoryThird']] = assigneNum;
                }
            });

            const categorys = {}
            Ux.onDatum({state}, "data.category").forEach(cat => {
                categorys[cat['key']] = cat['name'];
            })

            state.$ciUse = {data: [], config: {}};
            for (let i in usedata) {
                state.$ciUse.data.push({key:i, name:categorys[i], value:usedata[i]});
            }

            state.$ciAss = {data: [], config: {}};
            for (let i in assData) {
                state.$ciAss.data.push({key:i, name:categorys[i], value:assData[i]});
            }
            return Ux.promise(state);
        }).then(Ux.ready).then(Ux.pipe(reference));

        Ux.ajaxPost("/api/up/report/list", {criteria: {sigma}}).then(response => {
            state.$data = Ux.valueArray(response);
            return Ux.promise(state);
        }).then(state => {
            const data = {create: {}, hand: {}};
            const promises = [];
            state.$data.forEach(temp => {
                //本人提交
                if (temp['createdBy'] === state.$loginUser['key']) {
                    const tempCreate = data['create'][temp['catalog']] ? data['create'][temp['catalog']] : [];
                    if (temp['traceId'].indexOf(tempCreate) <= 0) {
                        tempCreate.push(temp['traceId']);
                    }
                    data['create'][temp['catalog']] = tempCreate;
                }
                //本人处理
                promises.push(
                    Ux.ajaxPost("/api/up/report/activity", {
                        key: temp['key'],
                        modelKey: temp['traceId'],
                        user: state.$loginUser
                    }).then(result => {
                        const tempResult = {create: null, hand: null, other: null, user: state.$loginUser}
                        result.forEach(activity => {
                            if (activity['createdBy'] === state.$loginUser['key'] && tempResult.hand == null) {
                                tempResult.hand = temp;
                            }
                        })
                        return tempResult;
                    })
                )
            })

            return Ux.parallel(promises).then(result => {
                result.forEach(each => {
                    const handTicket = each.hand;
                    if (handTicket !== null) {
                        const tempHand = data['hand'][handTicket['catalog']] ? data['hand'][handTicket['catalog']] : [];
                        if (handTicket['traceId'].indexOf(tempHand) <= 0) {
                            tempHand.push(handTicket['traceId']);
                        }
                        data['hand'][handTicket['catalog']] = tempHand;
                    }
                })

                state.$submit = {data: [], config: {}};
                state.$hand = {data: [], config: {}};
                Ux.onDatum({state}, "service.catalog").forEach(each => {
                    let scount = data.create[each.code] ? Ux.valueArray(data.create[each.code]).length : 0;
                    if (scount !== 0) {
                        state.$submit.data.push({key:each.code,name:each.name,value:scount});
                    }
                    let hcount = data.hand[each.code] ? Ux.valueArray(data.hand[each.code]).length : 0;
                    if (hcount.value !== 0) {
                        state.$hand.data.push({key:each.code,name:each.name,value:hcount});
                    }
                })
                return Ux.promise(state);
            }).then(Ux.ready).then(Ux.pipe(reference));
        })
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
            const attrPage = Sk.mix(__.upg_todo_report)
            return (
                <div {...attrPage}>
                    <Row>
                        {renderRegion(this, "submitted", Rdr.renderBar1)}
                        {renderRegion(this, "processed", Rdr.renderBar2)}
                    </Row>
                    <Row>
                        {renderRegion(this, "asset", Rdr.renderBar3)}
                        {renderRegion(this, "usage", Rdr.renderBar4)}
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("PxPending").page());
    }
}

export default Component