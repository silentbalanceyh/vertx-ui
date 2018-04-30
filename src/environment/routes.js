import React from "react";
import {Route, Switch} from "react-router-dom";
import Component from "../components/index";
import Container from "../container/index";
import {DataLabor} from "entity";
import Ux from 'ux';
// 全局时间locale格式化，临时方案
import 'moment/locale/zh-cn';
import moment from 'moment';

moment.locale('zh-cn');
const route = uri => `/${process.env.ROUTE}${uri}`;
const connect = (Uri, Layout, Page, key) => {
    const render = props => {
        const router = DataLabor.getRouter(props);
        return <Layout $router={router} component={Page}/>;
    };
    return <Route key={key} exact path={route(Uri)} render={render}/>;
};
Ux.dgRouter(Ux, Container, Component);
const routes = Ux.route(Container, Component);
export default (
    <Switch>
        {routes.map(route => connect(route.uri,
            route.container, route.component, route.key))}
    </Switch>
);
