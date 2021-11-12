import React from 'react';
import BpmnJS from 'bpmn-js';

class Component extends React.PureComponent {
    componentDidMount() {
        const viewer = new BpmnJS();
        viewer.attachTo("#divEditor");
    }

    render() {
        return (
            <div id={'divEditor'} ref={'divEditor'} style={{
                width: 600,
                height: 400
            }}>
                「Zero Extension」系统设置 -> 流程设计
            </div>
        );
    }
}

export default Component;