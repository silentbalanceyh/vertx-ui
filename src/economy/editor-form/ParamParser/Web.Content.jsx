import React from 'react';
import {Col, Row, Table} from 'antd';
import UiForm from './forms/Web.Form';
import {Dsl} from 'entity';
import './Cab.less';
import Ux from 'ux';

export default (reference) => {
    const {$table = {}, data = []} = reference.state;
    return (
        <div>
            <Row className={"web-param-table"}>
                <Col span={24}>
                    <Table {...$table} dataSource={data}/>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <UiForm reference={reference} onChange={params => {
                        if (params.name) {
                            const $params = Ux.clone(params);
                            const {data = []} = reference.state;
                            const dataArray = Dsl.getArray(data);
                            dataArray.saveElement($params);
                            reference.setState({data: dataArray.to()});
                        }
                    }}/>
                </Col>
            </Row>
        </div>
    );
}