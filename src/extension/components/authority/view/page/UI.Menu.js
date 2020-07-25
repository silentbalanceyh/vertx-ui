import React from 'react';
import Ux from "ux";
import Op from './Op.Menu';
import Ex from "ex";
import {Button, Col, Row, Spin, Tree} from 'antd';

const renderGrid = (reference) => {
    const {
        $source = [], $keySet,
        $submitting = false
    } = reference.state;
    const grid = Ux.elementGrid($source, 4);
    return (
        <Spin spinning={$submitting}>
            {grid.map((row, rowIndex) => (
                <Row key={`row${rowIndex}`}>
                    {row.map(col => {
                        /*
                         * 当前树中所有
                         */
                        const current = [];
                        Ux.itTree([col], item => current.push(item.key));
                        /*
                         * 当前树中被选择的
                         */
                        const keys = Ux.immutable(Array.from($keySet));
                        const checkedKeys = current.filter(key => keys.contains(key));
                        return (
                            <Col span={6} key={`col${col.key}`}>
                                <Tree treeData={[col]}
                                      onCheck={Ux.rxCheckedTree(reference, [col])}
                                      checkedKeys={checkedKeys}
                                      checkStrictly
                                      selectable={false}
                                      checkable defaultExpandAll/>
                            </Col>
                        )
                    })}
                </Row>
            ))}
        </Spin>
    )
}

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Menu")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$button = [], $submitting = false} = this.state;
            return (
                <div className={"page-menu"}>
                    <Row className={"page-op"}>
                        <Col span={24}>
                            {$button.map(op => {
                                const {text, ...rest} = op;
                                return (
                                    <Button {...rest} loading={$submitting}>
                                        {text}
                                    </Button>
                                )
                            })}
                        </Col>
                    </Row>
                    {renderGrid(this)}
                </div>
            );
        }, Ex.parserOfColor("Rule-Menu").define())
    }
}

export default Component