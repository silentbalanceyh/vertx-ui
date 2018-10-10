import React from 'react';
import {Col, Input, Row, Tag} from "antd";
import Rdr from './UI.Filter.Render';

class Component extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {filters: {}};
    }

    render() {
        const {filters = {}} = this.state;
        const {config = {}} = this.props;
        const filter = config.filter ? config.filter : [];
        return 0 < filter.length ? (
            <Row className={"web-table-transfer-row"}>
                <Col span={2} style={{paddingTop: 3, paddingLeft: 5}}>
                    {config.prefix ? (
                        <Tag color={"magenta"}>{`${config.prefix}：`}</Tag>
                    ) : ""}
                </Col>
                {filter.map(item => (
                    <Col span={3} key={item.key}>
                        <Input placeholder={item.placeholder}
                               style={{width: "90%"}}
                               onChange={Rdr.on2Filter(this, item.key)}
                               value={filters[item.key]}/>
                    </Col>
                ))}
                <Col span={2}>
                    {Rdr.renderButton(this)}
                </Col>
            </Row>
        ) : false;
    }
}

export default Component;