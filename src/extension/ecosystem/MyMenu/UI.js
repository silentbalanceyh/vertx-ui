import React from 'react';
import {PageCard} from "web";
import Ux from 'ux';
import {Alert, Icon, Spin, Switch} from "antd";
import Ex from "ex";
import Op from './Op';
import './Cab.less';
import Rdr from './Web.jsx';

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
            state.$tree = source;
            state.$treeConfig = tree;
            state.$ready = true;
            reference.setState(state);
        }).catch(error => reference.setState({error}))
    } else {
        console.error("对不起，配置 config 丢失或路由对象 $router 丢失", config, $router)
    }
}

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("MyMenu")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const switcher = Ux.fromHoc(this, "switcher");
            const info = Ux.fromHoc(this, "info")
            const {$data = [], $admin = false, $changed, $submitting = false} = this.state;
            return (
                <div className={"ux-my-menu"}>
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
                                            <Icon type={menu.icon}
                                                  className={
                                                      $admin ? "icon icon-admin" : "icon icon-view"
                                                  }
                                                  style={menu.style ? menu.style : {
                                                      color: "white",
                                                      backgroundColor: Ex.toColor(index)
                                                  }}/>
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
            )
        }, Ex.parserOfColor("MyMenu").control())
    }
}

export default Component