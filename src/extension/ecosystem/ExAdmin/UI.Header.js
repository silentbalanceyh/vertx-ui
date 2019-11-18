import React from 'react'
import Ux from "ux";
import renderJsx from './Web.Header.jsx';
import Op from './Op';
import Ex from 'ex';

/*
 * React属性props:
 * 1) 全局：$router, $menus, $app, $user
 * 2) 统一：config, data
 * 3) 函数：fnApp, fnCollapse, fnOut
 * 4) 风格：css
 * css =
 * {
 * }
 * config =
 * {
 *      banner:
 *      icon
 * }
 */
@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("ExAdmin")
    .ready(true)
    .to()
)
class Component extends React.PureComponent {

    render() {
        return Ex.yoRender(this, () => {
            const {config = {}, fnCollapse} = this.props;
            const window = Ux.fromHoc(this, 'window');
            const accounts = Op.yoAccount(this, {
                window
            });
            return renderJsx(this, {
                accounts,
                icon: config.icon,
                fnCollapse
            })
        }, Ex.parserOfColor("ExHeader").private())
    }
}

export default Component
