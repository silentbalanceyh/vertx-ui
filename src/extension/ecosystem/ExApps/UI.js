import React from 'react';
import './Cab.less';
import Ex from 'ex';
import {Icon} from "antd";
import {Link} from "react-router-dom";
import Ux from "ux";

/**
 * ## 「组件」`ExApps`
 *
 * ```js
 * import { ExApps } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * ### 2. 核心
 *
 * #### 2.1.菜单执行
 *
 * 菜单只提取`APP-MENU`类型，`X_MENU`数据对接，并转换成react-router常用链接。
 *
 * @memberOf module:web-component
 * @method ExApps
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = {};
    state.$ready = true;
    const {data = [], $app} = reference.props;
    const $source = Ux.clone(data);
    $source.forEach(item => item.sort = item.order);
    /*
     * 过滤菜单
     */
    let filtered = Ux.clone($source)
        .filter(item => Ux.Env.MENU_TYPE.APP === item.type)
        .sort((left, right) => left.sort - right.sort);
    state.$data = Ux.toLink(filtered, $app);
    reference.setState(state);
};

class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {

        return Ex.yoRender(this, () => {
            const {$data = []} = this.state;
            return (
                <div className={"ux-app"}>
                    {$data.map((menu, index) => (
                        <Link key={menu.key} to={menu.uri}>
                            <Icon type={menu.icon}
                                  style={{
                                      color: "white",
                                      backgroundColor: Ex.toColor(index)
                                  }}/>
                            <span className={"label"}>{menu.text}</span>
                        </Link>
                    ))}
                </div>
            );
        }, Ex.parserOfColor("ExApps").component());
    }
}

export default Component;