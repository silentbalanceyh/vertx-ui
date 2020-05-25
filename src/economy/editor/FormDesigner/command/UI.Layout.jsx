import React from 'react';
import {component} from "../../../_internal";
import UiForm from '../Web.Form';
import Ux from 'ux';
import Op from '../op';
import {Col, Empty, Icon, Row, Tag} from 'antd';

const layoutView = (reference, jsx = {}) => {
    const ref = Ux.onReference(reference, 1);
    const {$layoutTitle} = ref.state;
    return (
        <div>
            <Row>
                <Col span={24}>
                    <Tag color={"blue"} style={{fontSize: 14}}>
                        <Icon type={"arrow-down"}/>&nbsp;&nbsp;
                        {$layoutTitle}
                    </Tag>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    {(() => {
                        const value = Ux.formHit(reference, "window");
                        if (value) {
                            return "Hello"
                        } else {
                            return (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>)
                        }
                    })()}
                </Col>
            </Row>
        </div>
    )
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Layout",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiLayout(this);
    }

    render() {
        /*
         * 配置处理
         */
        const {$inited = {}} = this.props;
        const config = Ux.fromHoc(this, "form");
        return (<UiForm reference={this}
                        config={{form: config}}
                        $renders={{
                            layoutView
                        }}
                        $inited={$inited}/>);
    }
}

export default Component