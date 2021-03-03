import Ux from 'ux';
import {Button, Col, Radio} from 'antd';
import React from 'react';
import WebAttr from './form/Web.Attribute';
import WebAction from './form/Web.Action';

import {Dsl} from 'entity';
import {Of} from 'app';

import Act from './Op.Event';

const RENDER = {
    type: Ux.ai2Select((reference) => (value) => {
        Dsl.of(reference).bind(Of.apiTagCategories).ok(response => {
            // 专用处理下拉
            reference.setState({$dropCategory: response});
        }).async({parentId: value})
    }),
    dataModel: Ux.ai2Select((reference) => (value) => {
        Dsl.of(reference).bind(Of.apiTagAttributes).ok(response => {
            // 专用处理下拉
            const {attribute = [], action = []} = response;
            reference.setState({
                $dropAttribute: attribute,
                $dropAction: action
            });
        }).async({modelId: value})
    })
}

const renderAttr = (reference) => {
    const {form} = reference.props;
    const formConfig = Ux.fromHoc(reference, "form");
    const fieldConfig = formConfig ? formConfig.attributes : {};
    const {getFieldDecorator} = form;
    // $dropAttribute
    // $dropCategory
    const {$dropCategory = [], $dropAttribute = []} = reference.state;
    const {$inited = {}} = reference.state;
    return getFieldDecorator("attributes", {
        initialValue: $inited['attributes']
    })(
        <WebAttr {...fieldConfig.optionJsx} $dropCategory={$dropCategory} $dropAttribute={$dropAttribute}/>
    )
}
const renderAction = (reference) => {
    const {form} = reference.props;
    const formConfig = Ux.fromHoc(reference, "form");
    const fieldConfig = formConfig ? formConfig.actions : {};
    const {getFieldDecorator} = form;
    // $dropAction
    const {$dropAction = []} = reference.state;
    const {$inited = {}} = reference.state;
    return getFieldDecorator("actions", {
        initialValue: $inited['actions']
    })(<WebAction {...fieldConfig.optionJsx} $dropAction={$dropAction}/>)
}
const renderInput = (reference, field, fnJsx) => {
    const formConfig = Ux.fromHoc(reference, "form");
    const fieldConfig = formConfig ? formConfig[field] : {};
    const {$inited = {}} = reference.state;
    return Ux.aiFormField(reference, {
        ...fieldConfig,
        optionConfig: {
            ...fieldConfig.optionConfig,
            initialValue: $inited[field]
        },
        optionItem: {
            ...fieldConfig.optionItem,
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        }
    }, fnJsx)
}
const renderSelect = (reference, field) => {
    const fnJsx = RENDER[field];
    return renderInput(reference, field, fnJsx);
}
const renderConnector = (reference, style = {}) => {
    const {form} = reference.props;
    const {getFieldDecorator} = form;
    const {$inited = {}} = reference.state;
    return getFieldDecorator("connector", {
        initialValue: $inited.connector
    })(
        <Radio.Group style={style}>
            <Radio.Button value={"and"} className={"input-connect"}>and</Radio.Button>
            <Radio.Button value={"or"} className={"input-connect"}>or</Radio.Button>
        </Radio.Group>
    )
}
const renderSubmit = (reference) => {
    const form = Ux.fromHoc(reference, "form");
    const {submit = {}} = form;
    const {$submitting = false} = reference.state;
    const action = Ux.toQuery("action");
    return (
        <Col span={24} className={"ops-submit"}>
            <Button onClick={Act.rxCancel(reference)} loading={$submitting}>
                {submit.cancel}
            </Button>
            {"VIEW" !== action ? (
                <Button type={"primary"} onClick={Act.rxSubmit(reference)} loading={$submitting}>
                    {submit.save}
                </Button>
            ) : false}
        </Col>
    )
}
export default {
    renderInput,
    renderSelect,
    renderConnector,
    renderAttr,
    renderAction,
    renderSubmit,
}