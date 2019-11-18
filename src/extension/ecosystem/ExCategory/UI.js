import React from 'react';
import Op from './Op';
import Ex from 'ex';
import {Menu} from 'antd';
import './Cab.less';

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Op.yiSider(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 菜单专用
             */
            const menuData = Op.yoMenu(this);

            return (
                <Menu onSelect={Op.rxSelect(this)} className={'ex-category'}>
                    {menuData.map(menu => {
                        const {text, ...rest} = menu;
                        return (
                            <Menu.Item {...rest}>{text}</Menu.Item>
                        )
                    })}
                </Menu>
            );
        }, Ex.parserOfColor("ExButton").component())
    }
}

export default Component;