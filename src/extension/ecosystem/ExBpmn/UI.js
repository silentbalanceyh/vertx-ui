import React from 'react';
import BpmnJs from 'bpmn-js';
import './Cab.less';
import {Col, Row} from 'antd';

class Component extends React.PureComponent {
    componentDidMount() {
        const {config} = this.props;
        if (config) {
            const viewer = new BpmnJs();
            viewer.importXML(config).then(response => {
                viewer.get('canvas').zoom('fit-viewport');
            });
            viewer.attachTo("#bpmnContainer")
        }
    }

    render() {
        const {$offset = 3, $canvas = {}} = this.props;
        const $span = 24 - $offset;
        const {height = 200} = $canvas;
        return (
            <div className={"web-bpmn"}>
                <Row>
                    <Col span={$span} offset={$offset}>
                        <div ref={"bpmnContainer"} style={{
                            height
                        }} id={"bpmnContainer"}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Component