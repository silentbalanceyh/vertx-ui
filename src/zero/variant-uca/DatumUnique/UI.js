import React from 'react';
import Op from './Op';
import {Col, Form, Input, Row} from 'antd';
import __Zn from '../zero.uca.dependency';
import {uca} from 'zi';

@uca({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {$input = {}, data = {}} = this.state;
            const {source = {}, output = {}, condField = {}, condValue = {}} = $input;
            const values = data;
            const {disabled = false} = this.props;
            return (
                <div>
                    <Row>
                        <Col span={12}>
                            <Form.Item {...Op.ITEM_OPTION} label={source.label}>
                                <Input {...source.optionJsx}
                                       disabled={disabled}
                                       onChange={Op.onChange(this, 'source')}
                                       value={values.source}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item {...Op.ITEM_OPTION} label={output.label}>
                                <Input {...output.optionJsx}
                                       disabled={disabled}
                                       onChange={Op.onChange(this, 'output')}
                                       value={values.output}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item {...Op.ITEM_OPTION} label={condField.label}>
                                <Input {...condField.optionJsx}
                                       disabled={disabled}
                                       onChange={Op.onChange(this, 'condField')}
                                       value={values.condField}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item {...Op.ITEM_OPTION} label={condValue.label}>
                                <Input {...condValue.optionJsx}
                                       disabled={disabled}
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