import Ex from 'ex';
import TplPage from "../../control/TplPage/UI";
import React from 'react';
import {Col, Row} from 'antd';
import Ux from 'ux';
import JsonView from 'react-json-view';

const tplPage = (reference, pages = {}) => {
    const $pages = {};
    Object.keys(pages).forEach(key => {
        $pages[key] = () => {
            const {json = {}} = reference.state;
            return (
                <Row>
                    <Col span={12}>
                        {Ux.isFunction(pages[key]) ? pages[key]() : false}
                    </Col>
                    <Col span={12}>
                        <JsonView src={json} name={false}/>
                    </Col>
                </Row>
            )
        }
    })
    return Ex.ylCard(reference, () => {
        return (
            <TplPage pages={$pages}/>
        )
    }, Ex.parserOfColor("TplPageFn").tpl())
}
export default {
    tplPage
}