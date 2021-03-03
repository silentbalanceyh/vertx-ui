import React from 'react';
import Ux from "ux";
import Ex from "ex";
import {ExForm} from "ei";
import {Button, Col, DatePicker, Row} from 'antd';
import Op from '../Op.Event';

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Form.Search")
    .to()
)
class Component extends React.PureComponent {
    render() {
        /*
         * 配置处理
         */
        const {$inited = {}, $mode = Ux.Env.FORM_MODE.ADD} = this.props;
        const formAttrs = Ex.yoAmbient(this);
        formAttrs.$inited = $inited;
        formAttrs.$mode = $mode;
        formAttrs.config = {form: Ux.fromHoc(this, "form")};
        /*
         * 按钮
         */
        const button = Ux.fromHoc(this, "button");
        const {$submitting = false} = this.props;
        return (
            <Row className={"row-search"}>
                <Col span={20}>
                    <ExForm {...formAttrs} $height={"90px"} $renders={{
                        createTime: (reference, jsx = {}) => {
                            return (<DatePicker.RangePicker className={"ops-search-range"} {...jsx}/>)
                        },
                        updateTime: (reference, jsx = {}) => {
                            return (<DatePicker.RangePicker className={"ops-search-range"} {...jsx}/>)
                        }
                    }} $op={Op.actions}/>
                </Col>
                <Col span={4} className={"op-condition"} style={{
                    lineHeight: "80px"
                }}>
                    <div className={"button"}>
                        <Button type={"primary"}
                                onClick={Op.$opSearchForm(this)}
                                loading={$submitting}>
                            {button.submit}
                        </Button>
                        &nbsp;&nbsp;
                        <Button onClick={Op.$opSearchReset(this)}
                                loading={$submitting}>
                            {button.reset}
                        </Button>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default Component