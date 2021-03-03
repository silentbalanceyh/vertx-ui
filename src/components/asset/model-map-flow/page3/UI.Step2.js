import React from 'react';
import Ux from "ux";
import Ex from "ex";
import '../Cab.less';
import {Button, Checkbox, Col, Form, Row, Tag} from 'antd';
import Op from './Op';

const yiInternal = (reference) => {
    const state = {};
    state.$ready = true;
    const {$inited = {}, $source = []} = reference.props;
    const options = [];
    $source.forEach(item => {
        const option = {};
        option.value = item.id;
        option.label = item.name;
        options.push(option);
    });
    state.$options = options;
    state.$info = Ux.fromHoc(reference, "info");
    const {columnsAct = []} = $inited;
    state.$keySet = new Set(columnsAct);
    reference.setState(state);
}

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Page3.Step2")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$options = [], $keySet, $info = {}} = this.state;
            return (
                <div className={"form-step2"}>
                    <Button id={"$opStep2"} className={"ux-hidden"} onClick={Op.rxStep2(this)}/>
                    <Row>
                        <Col span={3} className={"title"}>
                            {$info.selected}：
                        </Col>
                        <Col span={21} className={"selected"}>
                            {(() => {
                                if ($keySet) {
                                    const items = $options.filter(item => $keySet.has(item.value));
                                    return 0 === items.length ? $info.empty : (
                                        items.map(option => (
                                            <Tag color={"blue"} key={option.value}>
                                                {option.label}
                                            </Tag>
                                        ))
                                    )
                                } else return $info.empty;
                            })()}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={3} className={"title"}>
                            {$info.pending}：
                        </Col>
                        <Col span={21}>
                            {(() => {
                                let checked = false;
                                let count = 0;
                                if ($keySet) {
                                    count = $options.filter(item => $keySet.has(item.value)).length;
                                    checked = (count === $options.length);
                                }
                                return (
                                    <div>
                                        <Checkbox onChange={Op.rxCheckedAll(this)} checked={checked}/>
                                        &nbsp;&nbsp;{$info.checked}
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        {(() => {
                                            const counter = Ux.formatExpr($info.counter, {count});
                                            return (
                                                <Tag color={"magenta"}>
                                                    {counter}
                                                </Tag>
                                            )
                                        })()}
                                    </div>
                                )
                            })()}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={21} offset={3} className={"content"}>
                            {(() => {
                                let value = $keySet ? Array.from($keySet) : [];
                                return (
                                    <Checkbox.Group options={$options}
                                                    onChange={Op.rxChecked(this)}
                                                    value={value}/>
                                )
                            })()}
                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor("PxPage3Form2").page());
    }
}

export default Form.create({})(Component)