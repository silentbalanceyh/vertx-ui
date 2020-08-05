import Ux from "ux";
import {Col, Row, Tabs} from 'antd';
import React from 'react';
import {LoadingAlert} from 'web';
import renderJsx from './page';
import renderExtra from './Web.Extra';

const fnJsx = {
    tabIntro: (reference) => {
        const alert = Ux.fromHoc(reference, "alert");
        return (
            <LoadingAlert $alert={alert}/>
        )
    },
    tabUi: (reference) => {
        const tabs = Ux.fromHoc(reference, "subtabs");
        const $tabs = Ux.configTab(reference, tabs);
        const {items = [], ...rest} = $tabs;
        /* 处理激活 activeKey */
        const {$activePage} = reference.state;
        return (
            <Tabs {...rest} className={"ex-tabs"}
                  activeKey={$activePage}
                  tabBarExtraContent={renderExtra(reference)}
                  onTabClick={$activePage => reference.setState({$activePage})}>
                {items.map(item => (
                    <Tabs.TabPane {...item}>
                        {(() => {
                            const executor = renderJsx(item.key);
                            if (Ux.isFunction(executor)) {
                                const {$config = {}} = reference.state;
                                const pageConfig = $config[item.key];
                                return executor(reference, pageConfig);
                            } else return false;
                        })()}
                    </Tabs.TabPane>
                ))}
            </Tabs>
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