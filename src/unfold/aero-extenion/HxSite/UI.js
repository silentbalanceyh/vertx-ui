import React from "react";
import Ux from 'ux';
import __Zn from "../zero.aero.dependency";
import Op from './Op';
import Sk from 'skin';
import "./Cab.norm.scss";
import {Col, Row} from "antd";
import renderCard from './Web';

const UCA_NAME = "HxSite";

const componentInit = (reference) => {
    Ux.dgAdmit(reference.props, UCA_NAME);
    const state = {};
    // treeData
    const $tree = {};
    $tree.selectable = false;
    $tree.checkable = true;
    $tree.collapsable = false;
    $tree.showIcon = true;
    $tree.checkStrictly = true;
    $tree.defaultExpandAll = true;   // 默认全展开
    state.$tree = $tree;
    // matrix
    state.$card = Op.yiCard(reference);
    // aclRegionInit
    __Zn.aclRegionInit(reference).then((response = {}) => {

        Object.assign(state, response);

        Ux.of(reference).in(state).ready().done();
        // reference.?etState(state);
        Ux.dgAdmit(state, UCA_NAME, false);
    })
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return __Zn.yoRender(this, () => {
            const {$card = []} = this.state;
            const {config = {}} = this.props;
            const {columns = 3} = config;
            const $matrix = Ux.toArray($card, columns);

            const attrHx = Sk.mixHx(UCA_NAME);
            return (
                <div {...attrHx}>
                    {$matrix.map((row, index) => (
                        <Row key={`row${index}`}>
                            {row.map((cell, cindex) => (
                                <Col key={cell.key} {...Op.yoCol(cindex, columns)}>
                                    {renderCard(this, cell)}
                                </Col>
                            ))}
                        </Row>
                    ))}
                    {__Zn.webAnchor(this, [
                        __Zn.aclE.rxSendFn,    // `Save Action`
                    ])}
                </div>
            )
        }, __Zn.parserOfColor(UCA_NAME).internal({off: true}))
    }
}

export default Component