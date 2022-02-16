import React from 'react';
import BpmnJs from 'bpmn-js';
import './Cab.less';
import {Col, Row} from 'antd';
import Ux from 'ux';

const drawTask = (task, canvas, phase) => {
    let classPrefix;
    if ("CANCELED" === phase) {
        classPrefix = 'ex-bpmn-error'
    } else if ("FINISHED" === phase) {
        classPrefix = 'ex-bpmn-end'
    } else {
        classPrefix = 'ex-bpmn-active'
    }
    canvas['addMarker'](task, classPrefix);
    try {
        canvas['addMarker'](`${task}_label`, classPrefix + "-label")
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
    const {data = {}, task, trace = [], phase} = reference.props;
    const viewer = componentBpmn();
    viewer.importXML(data).then(response => {
        const {warnings = []} = response;
        if (0 === warnings.length) {
            const canvas = viewer.get('canvas');
            canvas.zoom('fit-viewport');
            if (task && "string" === typeof task) {
                drawTask(task, canvas, phase);
            }
            if (Ux.isArray(trace)) {
                drawHistory(trace, canvas);
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
        const {$canvas = {}} = this.props;
        const {height = 200, offset = 4} = $canvas;
        const span = 24 - offset;
        // Ux.dgDebug($canvas, "BPMN图大小", "#0094d1")
        return (
            <div className={"ex-bpmn"}>
                <Row>
                    <Col span={span} offset={offset}>
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