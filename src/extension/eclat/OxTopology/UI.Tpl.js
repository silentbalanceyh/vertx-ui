import React from 'react';
import Ux from 'ux';
import {LoadingAlert} from 'web';
import {Col, List, Radio, Row} from 'antd';
import './Cab.less';

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("ExTpl")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {$inited = []} = this.props;
        const alert = Ux.fromHoc(this, 'alert');
        const options = Ux.fromHoc(this, 'options');
        return (
            <div>
                <LoadingAlert $alert={alert}/>
                <Radio.Group className={"ox-tpl-row"}>
                    <Row>
                        {options.map(option => (
                            <Col key={option.key} span={8} offset={2}>
                                <Radio key={option.key} value={option.value}/>
                                &nbsp;&nbsp;
                                {option.name}
                            </Col>
                        ))}
                    </Row>
                </Radio.Group>
                <Radio.Group className={"ox-tpl-row ox-tpl-range"}>
                    <List dataSource={$inited} renderItem={option => (
                        <Row key={option.key} className={'item'}>
                            <Col span={18} offset={2}>
                                <Radio key={option.key} value={option.value}/>
                                &nbsp;&nbsp;
                                {option.name}
                            </Col>
                        </Row>
                    )}/>
                </Radio.Group>
            </div>
        )
    }
}

export default Component;