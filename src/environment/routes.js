import React from "react";
import { Route, Switch } from "react-router-dom";

import Pages from "../components/index";
import Layout from "../container/index";
import { DataLabor } from "../entity";
// 全局时间locale格式化，临时方案
import 'moment/locale/zh-cn';
import moment from 'moment';

moment.locale('zh-cn');

const route = uri => `/${process.env.$PATH}${uri}`;

const connect = (Uri, Layout, Page) => {
    const render = props => {
        const router = DataLabor.getRouter(props);
        return <Layout $router={ router } component={ Page }/>;
    };
    return <Route exact path={ route(Uri) } render={ render }/>;
};

export default (
    <Switch>

    </Switch>
);
