import React from 'react';
import {component} from "../../_internal";
import Op from './op';
import Ux from 'ux';
import {Col, Form, Input, Row} from 'antd';

@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ux.xtReady(this, () => {
            const {$input = {}, data = {}} = this.state;
            const {source = {}, output = {}, condField = {}, condValue = {}} = $input;
            const values = data;
            return (
                <div>
                    <Row>
                        <Col span={12}>
                            <Form.Item {...Op.ITEM_OPTION} label={source.label}>
                                <Input {...source.optionJsx}
                                       onChange={Op.onChange(this, 'source')}
                                       value={values.source}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item {...Op.ITEM_OPTION} label={output.label}>
                                <Input {...output.optionJsx}
                                       onChange={Op.onChange(this, 'output')}
                                       value={values.output}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item {...Op.ITEM_OPTION} label={condField.label}>
                                <Input {...condField.optionJsx}
                                       onChange={Op.onChange(this, 'condField')}
                                       value={values.condField}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item {...Op.ITEM_OPTION} label={condValue.label}>
                                <Input {...condValue.optionJsx}
                                       onChange={Op.onChange(this, 'condValue')}
                                       value={values.condValue}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </div>
            )
        })
    }
}

export default Component