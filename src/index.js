import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { BrowserRouter } from "react-router-dom";
import workers from "./entry/workers";
// 统一引入AntDesign样式
import 'ant-design-pro/dist/ant-design-pro.css';

import createStore from "./entry/store";
import routes from "./environment/routes";

const store = createStore();

ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <Provider store={store}>
            <BrowserRouter>
                {routes}
            </BrowserRouter>
        </Provider>
    </LocaleProvider>, document.getElementById("root"));
workers();
