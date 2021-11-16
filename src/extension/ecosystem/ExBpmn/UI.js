import React from 'react';
import BpmnJs from 'bpmn-js';
import './Cab.less';
import {Col, Row} from 'antd';
import Ux from 'ux';

const drawTask = (task, canvas) => {
    canvas['addMarker'](task, 'ex-bpmn-active');
    try {
        canvas['addMarker'](`${task}_label`, 'ex-bpmn-active-label')
    } catch (ex) {
    }
}
const drawHistory = (histories = [], canvas) => {
    histories.forEach(history => {
        canvas['addMarker'](history, 'ex-bpmn-end');
        try {
            canvas['addMarker'](`${history}_label`, 'ex-bpmn-end-label')
        } catch (ex) {
        }
    })
}

const componentBpmn = () => new BpmnJs({
    // customize text
    textRenderer: {
        defaultStyle: {
            fontSize: '14px'
        }
    }
})

const componentInit = (reference) => {
    const {config = {}, task, history = []} = reference.props;
    const viewer = componentBpmn();
    viewer.importXML(config).then(response => {
        const {warnings = []} = response;
        if (0 === warnings.length) {
            const canvas = viewer.get('canvas');
            canvas.zoom('fit-viewport');
            if (task && "string" === typeof task) {
                drawTask(task, canvas);
            }
            if (Ux.isArray(history)) {
                drawHistory(history, canvas);
            }
        }
    });
    viewer.attachTo("#bpmnContainer")
}

class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        const {$offset = 3, $canvas = {}} = this.props;
        const $span = 24 - $offset;
        const {height = 200} = $canvas;
        return (
            <div className={"ex-bpmn"}>
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