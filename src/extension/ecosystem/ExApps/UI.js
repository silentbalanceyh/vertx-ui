import React from 'react';
import Op from './Op';
import './Cab.less';
import Ex from 'ex';
import {Icon} from "antd";
import {Link} from "react-router-dom";

class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
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