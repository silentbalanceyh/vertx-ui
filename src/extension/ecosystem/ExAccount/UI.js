import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import './Cab.less';
import {Icon} from "antd";
import ImgPhoto from "./image/user.png";

/**
 * ## 「组件」`ExAccount`
 *
 * ```js
 * import { ExAccount } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * @memberOf module:web-component
 * @method ExAccount
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = {};
    const user = Ux.isLogged();
    const config = Ux.fromHoc(reference, "account");
    /* 解决无内容的Bug */
    if (!user.icon) user.icon = `image:${ImgPhoto}`;
    /* 显示专用bug */
    const empty = Ux.fromHoc(reference, "empty");
    if (!user.workNumber) user.workNumber = empty;
    if (!user.workTitle) user.workTitle = empty;
    if (!user.workLocation) user.workLocation = empty;
    const data = Ux.formatTpl(user, config);
    state.$data = Ux.clone(data);
    state.$ready = true;
    reference.setState(state);
};

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("ExAccount")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$data = {}} = this.state;
            const {alias, icon, name, items = []} = $data;
            return (
                <div className={"ex-account"}>
                    <div className={"avatar-holder"}>
                        {Ux.aiIcon(icon)}
                        <div className={"name"}>{name}</div>
                        <div>{alias}</div>
                    </div>
                    <div className={"detail"}>
                        {items.map(item => (
                            <p key={Ux.randomUUID()}>
                                <Icon type={item.icon}/>
                                &nbsp;&nbsp;
                                {item.value}
                            </p>
                        ))}
                    </div>
                </div>
            )
        }, Ex.parserOfColor("ExAccount").component())
    }
}

export default Component;