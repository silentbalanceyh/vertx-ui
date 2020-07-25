import Ux from "ux";
import {Col, Row, Tabs} from 'antd';
import React from 'react';
import {LoadingAlert} from 'web';
import renderJsx from './page';

const fnJsx = {
    tabIntro: (reference) => {
        const alert = Ux.fromHoc(reference, "alert");
        return (
            <LoadingAlert $alert={alert}/>
        )
    }
}

export default (reference) => {
    const tabs = Ux.fromHoc(reference, "tabs");
    const $tabs = Ux.configTab(reference, tabs);
    const {items = [], ...rest} = $tabs;
    return (
        <Row>
            <Col span={24}>
                <Tabs {...rest} className={"ex-tabs"}>
                    {items.map(item => (
                        <Tabs.TabPane {...item}>
                            {(() => {
                                let executor = fnJsx[item.key];
                                if (Ux.isFunction(executor)) {
                                    return executor(reference);
                                } else {
                                    executor = renderJsx(item.key);
                                    if (Ux.isFunction(executor)) {
                                        const {$config = {}} = reference.state;
                                        const pageConfig = $config[item.key];
                                        return executor(reference, pageConfig);
                                    } else return false;
                                }
                            })()}
                        </Tabs.TabPane>
                    ))}
                </Tabs>
            </Col>
        </Row>
    )
}