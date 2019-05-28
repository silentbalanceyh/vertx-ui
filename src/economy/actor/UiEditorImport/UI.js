import React from 'react';
import {Button, Col, Icon, Row, Upload} from 'antd';
import './Cab.less';
import Ux from "ux";
import Op from './Op';
import {LoadingAlert} from "web";
import Fx from '../Fx';

class Component extends React.PureComponent {
    state = {
        $image: "",
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] UiEditorImport：", "#960");

        const {$notice = {}, $upload = "", $image, $button} = this.state;
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <LoadingAlert $alert={$notice}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} offset={9}>
                        <Upload listType={"picture-card"}>
                            {$image ? (
                                <img src={$image} alt={"File"}/>
                            ) : (
                                <div>
                                    <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                                    <div className="ant-upload-text">{$upload}</div>
                                </div>
                            )}
                        </Upload>
                        {$button ? (
                            <Button id={$button} className={"ux-hidden"}
                                    onClick={Fx.rxImport(this)}
                            />
                        ) : false}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Component;