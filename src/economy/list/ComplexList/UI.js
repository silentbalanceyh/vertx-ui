import React from 'react';
import Ux from 'ux';
import Op from './Op';
import {Tabs} from 'antd';
import {_zero} from '../../_internal/index';
import Fn from '../../_internal/Ix.Fn';
import {DataLabor} from 'entity';
import Render from './UI.Render';

@_zero({
    connect: {
        s2p: state => DataLabor.createOut(state)
            .rework({
                "grid": ["query", "list"]
            })
            .rinit(["query"])
            .to(),
    },
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
    state: {
        view: "list",
        key: undefined,
        drawer: false,
        term: "",
        tabs: {}
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        // Op.initGrid(this);
        // 验证当前组件是否准备完成
        const {reference, $key = "grid"} = this.props;
        const verified = Ux.verifyComplex(reference, $key);
        if (!verified) {
            Op.initGrid(this);
        } else {
            this.setState({error: verified});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        Op.updateGrid(this, prevProps);
        // 连接Monitor专用
        Fn.M.monitorComplexList(this, prevState);
    }

    render() {
        const {error} = this.state;
        if (error) {
            return Ux.fxError(error);
        } else {
            const $state = Op.mockVector(this);
            const {items = [], ...rest} = $state.tabs;
            // 关于tabs页的限制
            const options = Op.readOption(this);
            if (options.hasOwnProperty('tabs.count')) {
                let limit = Ux.valueInt(options['tabs.count']);
                // 最小限制是1，不应该是0
                if (0 === limit) limit = 1;
                items.forEach((item, index) => item.disabled = limit < items.length && 0 === index);
            }
            // 设置Style信息
            const {className = ""} = this.props;
            return (
                <Tabs {...rest} className={className}
                      tabBarExtraContent={Op.renderSubmit(this)}>
                    {items.map(item => {
                        const {type, ...itemRest} = item;
                        const fnRender = Render[type];
                        return fnRender(this, itemRest, rest.activeKey);
                    })}
                </Tabs>
            );
        }
    }
}

export default Component;