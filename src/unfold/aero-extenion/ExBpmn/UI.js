import React from 'react';
import BpmnJs from 'bpmn-js';

import {Col, Row} from 'antd';
import Ux from 'ux';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "ExBpmn"

const drawTask = (task, canvas, phase) => {
    let classPrefix;
    if ("CANCELED" === phase) {
        classPrefix = 'ux_bpmn_error'
    } else if (["END", "FINISHED"].includes(phase)) {
        classPrefix = 'ux_bpmn_end'
    } else {
        classPrefix = 'ux_bpmn_active'
    }
    canvas['addMarker'](task, classPrefix);
    try {
        canvas['addMarker'](`${task}_label`, classPrefix + "_label")
    } catch (ex) {
    }
}
const drawHistory = (histories = [], canvas) => {
    histories.forEach(history => {
        canvas['addMarker'](history, 'ux_bpmn_end');
        try {
            canvas['addMarker'](`${history}_label`, 'ux_bpmn_end_label')
        } catch (ex) {
        }
    })
}

const componentBpmn = (reference) => {
    const container = reference.containerRef.current;
    return new BpmnJs({
        // customize text
        textRenderer: {
            defaultStyle: {
                fontSize: 14
            }
        },
        container,
    })
}

const drawBpmn = (reference, canvas) => {
    const {
        task,
        trace = [],
        phase
    } = reference.props;
    const container = reference.containerRef.current;
    if (container) {
        canvas.viewbox({
            x: 0, y: 0,
            width: container.clientWidth,
            height: container.clientHeight
        })
    }
    canvas.zoom('fit-viewport');
    if (task && "string" === typeof task) {
        drawTask(task, canvas, phase);
    }
    if (Ux.isArray(trace)) {
        drawHistory(trace, canvas);
    }
}
const componentInit = (reference) => {
    const {
        data = {},
    } = reference.props;
    const viewer = componentBpmn(reference);
    viewer.importXML(data).then(response => {
        const {warnings = []} = response;
        if (0 === warnings.length) {
            const canvas = viewer.get('canvas');
            const eventBus = viewer.get('eventBus');
            const viewbox = canvas.viewbox();
            if (viewbox.width !== 0 && viewbox.height !== 0) {
                drawBpmn(reference, canvas);
            } else {
                eventBus.on("canvas.viewbox.changed", () => {
                    drawBpmn(reference, canvas);
                });
            }
        }
    });
    viewer.attachTo("#bpmnContainer");
    reference.viewer = viewer;
}

class Component extends React.PureComponent {

    displayName = UCA_NAME;

    constructor(props) {
        super(props);
        this.viewer = null;
        this.state = {$loading: true}
        this.containerRef = React.createRef();
    }

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const viewer = this.viewer;
        if (viewer) {
            const canvas = viewer.get('canvas');
            drawBpmn(this, canvas);
        }
    }

    render() {
        const {$canvas = {}} = this.props;
        const {height = 200, offset = 6} = $canvas;
        // Ux.dgDebug($canvas, "BPMN图大小", "#0094d1")
        const style = {height};
        style.paddingLeft = `${offset}%`;
        const attrBpmn = Sk.mixEx("ExBpmn");
        return (
            <div {...attrBpmn}>
                <Row>
                    <Col span={24}>
                        <div ref={this.containerRef}
                             className={"ux_container"}
                             style={style}
                             id={"bpmnContainer"}/>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Component