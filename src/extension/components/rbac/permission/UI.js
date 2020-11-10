import React from 'react'
import Ux from 'ux';
import Ex from 'ex';
import Op from './Op';
import {List} from 'antd';
import "./Cab.less";
import Image from './images';
import {ExDeploy} from "ei";

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            const {$alert = {}} = this.state;
            return (
                <div className={"web-authority"}>
                    <ExDeploy alert={$alert} $width={1050} step={5}/>
                    {(() => {
                        const {$apps = []} = this.state;
                        return (
                            <List className={"app-list"} dataSource={$apps} renderItem={item => {
                                const src = Image[item.key];
                                const attrs = {};
                                if (item.disabled) {
                                    attrs.className = "item item-disabled";
                                } else {
                                    attrs.className = "item";
                                    attrs.onClick = event => {
                                        Ux.prevent(event);
                                        const {$router} = this.props;
                                        Ux.toRoute(this, item.uri, {target: $router.path()});
                                    }
                                }
                                return (
                                    <a key={item.key} {...attrs}>
                                        <img alt={item.key} src={src}/>
                                        <label>{item.text}</label>
                                    </a>
                                )
                            }}/>
                        )
                    })()}
                </div>
            )
        }, Ex.parserOfColor("RxRBAC-Authority").page())
    }
}

export default Component