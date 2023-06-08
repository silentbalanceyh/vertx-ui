import React from 'react';
import {Col, Row, Spin, Table, Tag, Transfer} from 'antd';
import Op from './op/Op';
import Ux from "ux";

class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiWebSource(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuWebSource(this, {props: prevProps, state: prevState});
    }

    render() {
        return Ux.xtReady(this, () => {
            const {config = {}} = this.props;
            /*
             * transfer 专用属性
             */
            const {titles = []} = config;
            const {$spinning = false} = this.state;
            /*
             * attrs
             */
            const attrs = {};
            attrs.showSelectAll = false;
            attrs.titles = titles;
            attrs.className = 'web-transfer web-ex-transfer-perm';
            const {$source = [], $target = []} = this.state;
            attrs.targetKeys = $target;
            return (
                <Spin spinning={$spinning}>
                    <Transfer {...attrs} dataSource={$source}>
                        {(input = {}) => {
                            const {
                                direction,
                            } = input;
                            const isLeft = 'left' === direction;

                            let dataRecord = Ux.elementUnique($source, 'key', $target[0]);
                            if (!dataRecord) dataRecord = {};

                            if (isLeft) {
                                const {$table = {}} = this.state;
                                $table.rowSelection = {
                                    selectedRowKeys: $target,  // 选择专用
                                    type: "radio",
                                    onChange: Op.rxSrcSelect(this)
                                }
                                return (
                                    <Table {...$table} dataSource={$source}/>
                                )
                            } else {

                                const {$record = {}} = this.state;
                                const {data = {}, title, selected} = $record;
                                const unSelected = Ux.isEmpty(dataRecord);
                                const tagFont = {fontSize: 14}
                                return (
                                    <div className={"row"}>
                                        <Row className={"row-head"}>
                                            <Col span={16} offset={8}>
                                                {unSelected ? (
                                                    <Tag style={tagFont}>
                                                        {title}
                                                    </Tag>
                                                ) : (
                                                    <Tag style={tagFont} color={"green"} closable
                                                         onClose={Op.rxSrcUnSelect(this)}>
                                                        {selected}：{dataRecord.name}
                                                    </Tag>
                                                )}
                                            </Col>
                                        </Row>
                                        {Object.keys(data).map(key => (
                                            <Row key={key} className={"row-item"}>
                                                <Col span={7} className={"row-title"}>
                                                    {data[key]}
                                                </Col>
                                                <Col span={16} offset={1}>
                                                    {dataRecord[key]}
                                                </Col>
                                            </Row>
                                        ))}
                                    </div>
                                )
                            }
                        }}
                    </Transfer>
                </Spin>
            )
        })
    }
}

export default Component;