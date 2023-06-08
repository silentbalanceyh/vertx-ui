import React from 'react';
import Ux from 'ux';
import {Card, Col, Row, Tree} from 'antd';

import Op from './Op';
import __Zn from '../zero.aero.dependency';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "HxMenu";
/*
 * state
 * {
 *     $ready,
 *     $tree:           <Tree/> binding
 *     $matrix:         config -> group
 *                      config -> columns
 *     $span:           24 / columns
 *     $keySet:         Checked Keys
 *     $keyDefault:     ( Once ) Checked Keys
 * }
 */
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
    const {config = {}} = reference.props;
    const {group = [], columns = 3} = config;
    state.$matrix = Ux.toArray(group, columns);
    state.$span = 24 / columns;
    // aclRegionInit:
    __Zn.aclRegionInit(reference).then((response = {}) => {

        Object.assign(state, response);

        Ux.of(reference).in(state).ready().done();
        // reference.?etState(state);
        Ux.dgAdmit(state, UCA_NAME, false);
    });
}
const renderMenu = (reference, cell = {}) => {
    const {$tree = {}, $keySet} = reference.state;
    const treeAttrs = Ux.clone($tree);
    // treeData Calculate
    const treeData = Op.yoData(reference, cell);
    treeAttrs.treeData = treeData;
    // Card Calculate
    const cardAttrs = Op.yoCard(reference, cell);
    // Value Calculate
    treeAttrs.checkedKeys = Array.from($keySet);
    const height = Ux.toHeight(360);
    const bodyStyle = {
        height: height / 2,
        minHeight: height / 2
    }
    return (
        <Card {...cardAttrs} bodyStyle={bodyStyle}>
            <Tree {...treeAttrs}
                  onCheck={__Zn.aclE.rxCheckFn(reference, treeData)}/>
        </Card>
    );
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return __Zn.yoRender(this, () => {
            // $matrix
            const {$matrix = []} = this.state;
            const attrHx = Sk.mixHx(UCA_NAME);
            return (
                <div {...attrHx}>
                    {$matrix.map((row, index) => (
                        <Row key={`row${index}`}>
                            {row.map((cell, cindex = 0) => (
                                <Col key={cell.key} {...Op.yoCol(this, cindex)}>
                                    {renderMenu(this, cell)}
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