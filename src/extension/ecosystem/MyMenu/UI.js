import React from 'react';
import {PageCard} from "web";
import Ux from 'ux';
import {Alert, Spin, Switch} from "antd";
import Ex from "ex";
import Op from './Op';
import Rdr from './Web.jsx';
import "./Cab.norm.scss";
import Sk from 'skin';

const UCA_NAME = "MyMenu";
const componentInit = (reference) => {
    const state = {};
    const {config = {}, $router} = reference.props;
    if (config.parameter && undefined !== $router) {
        const {parameter = {}, tree = {}} = config;
        const page = $router.path();
        const request = Ux.clone(parameter);
        request.page = page;
        // 从后端读取数据
        Ux.ajaxPost("/api/my/menu/fetch", request).then(menus => {
            // 初始化
            menus = menus.sort(Ux.sorterAscTFn('uiSort'));
            state.$data = Op.toAttach(menus);
            // 子节点专用处理
            let {source = []} = reference.props;
            source = Ux.clone(source);
            {
                /*
                 * 1）去掉 /workflow 前缀
                 */
                source = source.filter(item => !item.uri.startsWith("/workflow"));
                /*
                 * 2）如果 uri = EXPAND，则检查是否包含 children
                 */
                const normalized = [];
                source.forEach(item => {
                    if ("EXPAND" === item.uri) {
                        let children = Ux.elementChildren(source, item, "parentId");
                        children = children.filter(item => "EXPAND" !== item.uri);  // 是否包含子节点
                        if (0 < children.length) {
                            normalized.push(item);
                        }
                    } else {
                        normalized.push(item);
                    }
                })
                state.$tree = normalized;
            }
            state.$treeConfig = tree;
            Ux.of(reference).in(state).ready().done();
            // reference.?etState(state);
            // state.$ready = true;
        })
    } else {
        console.error("对不起，配置 config 丢失或路由对象 $router 丢失", config, $router)
    }
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const switcher = Ux.fromHoc(this, "switcher");
            const info = Ux.fromHoc(this, "info")
            const {$data = [], $admin = false, $changed, $submitting = false} = this.state;
            return (
                <div {...Sk.mixMy(UCA_NAME)}>
                    <PageCard reference={this} $extra={
                        <div>
                            {Rdr.renderExtra(this)}
                            <Switch {...switcher}
                                    disabled={$submitting}
                                    onChange={Op.onSwitch(this)}
                                    checked={$admin}/>
                        </div>
                    }>
                        <Spin spinning={$submitting} tip={info.loading}>
                            {$changed ? (
                                <Alert message={info.notice} type={"warning"}/>
                            ) : false}
                            <div className={"content"}>
                                {$data.map((menu, index) => (
                                    <div key={menu.key} className={"range"}>
                                        {/* eslint-disable-next-line */}
                                        <a key={menu.key} className={
                                            $admin ? "link link-admin" : "link"
                                        } onClick={Op.onRoute(this, menu)}>
                                            {Ux.v4Icon(menu.icon, {
                                                className: $admin ? "icon icon-admin" : "icon icon-view",
                                                style: menu.style ? menu.style : {
                                                    color: "white",
                                                    backgroundColor: Ex.toColor(index)
                                                }
                                            })}
                                            <span className={"label"}>{menu.text}</span>
                                        </a>
                                        <div className={"link-op"}>
                                            {Rdr.renderButton(this, {
                                                data: menu,
                                                first: 0 === index,
                                                last: ($data.length - 1) === index
                                            })}
                                        </div>
                                    </div>
                                ))}
                                {Rdr.renderEmpty(this, $data)}
                                {Rdr.renderAdd(this)}
                            </div>
                        </Spin>
                    </PageCard>
                </div>
            );
        }, Ex.parserOfColor(UCA_NAME).control());
    }
}

export default Component