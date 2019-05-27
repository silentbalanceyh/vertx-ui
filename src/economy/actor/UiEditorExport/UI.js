import React from 'react';
import Op from './Op';
import Ux from "ux";
import './Cab.less';
import {Button, Checkbox, Col, Row} from 'antd';
import {LoadingAlert} from "web";
import Fx from "../Fx";

class Component extends React.PureComponent {
    state = {
        $selected: [],
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] UiEditorExport：", "#960");
        const {$notice = {}, $selected = [], $options = [], $button} = this.state;
        const {$config = {}} = this.props;
        const style = Fx.cssGrid($config);
        return (
            <div>
                <Row>
                    <Col span={24}>
                        <LoadingAlert $alert={$notice}/>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className={"ex-export"}>
                        <Checkbox.Group value={$selected} className={"group"}
                                        onChange={Op.onSelected(this)}>
                            {$options.map(item => {
                                return (
                                    <div style={style} key={item.key} className={"item"}>
                                        <Checkbox key={item.key} value={item.key}>
                                            {item.label}
                                        </Checkbox>
                                    </div>
                                )
                            })}
                        </Checkbox.Group>
                        {$button ? (
                            <Button id={$button} className={"ux-hidden"}
                                    onClick={Fx.rxExport(this)}/>
                        ) : false}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Component