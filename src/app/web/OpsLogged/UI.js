import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import {Icon} from "antd";
import {ExLogged} from 'ei';
import './Cab.less'

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {$logged = false, data = {}} = this.props;
        const {login = [], logged = []} = data;
        if ($logged) {
            /*
             * 已登录
             */
            const css = {
                clsDropdown: "menu-item ops-logged-dropdown",
                clsAccount: "action account ops-logged-account",
                clsAvatar: "avatar ops-logged-avatar",
                clsUser: "ops-logged-name",
                clsMenu: "ops-logged-menu"
            }
            const $logged = Ux.clone(logged);
            const window = Ux.fromHoc(this, "window");
            return (
                <div className={"ops-logged"}>
                    <ExLogged {...Ex.yoAmbient(this)} css={css} data={$logged}
                              config={{window}}/>
                </div>
            );
        } else {
            return login.map(each => (
                <a onClick={event => {
                    Ux.prevent(event);
                    Ux.toRoute(this, each.uri)
                }} key={each.key} className={"op-link"}>
                    <Icon type={each.icon}/>{each.text}
                </a>
            ))
        }
    }
}

export default Component