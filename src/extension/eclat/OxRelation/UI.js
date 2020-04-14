import React from 'react';
import Ex from 'ex';
import {ExRelation} from "ei";
import OxAnchor from '../OxAnchor/UI';
import Op from './Op';

class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiRelation(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {config = {}, $inited = {}} = this.props;
            const {category = {}, ...rest} = config;
            /*
             * 底层需要
             */
            const {$definition = false} = this.state;
            const attrs = Ex.configRelation($inited, {category}, this);
            attrs.config = Op.yoConfig(this, rest);
            /*
             * 继承属性
             */
            const inherit = Ex.yoAmbient(this);
            if ($definition) {
                /*
                 * 读取关系定义数据
                 */
                inherit.$definition = $definition;
            }
            /*
             * $column render for code = OxCi
             */
            attrs.$renders = {
                sourceCode: OxAnchor,
                targetCode: OxAnchor
            };
            /*
             * 特殊处理 rxView 外置方法，处理成标准 rxRefresh 方法
             */
            attrs.rxRefresh = inherit.rxView;
            return (
                <ExRelation {...inherit} {...attrs}/>
            );
        }, Ex.parserOfColor("OxRelation").component())
    }
}

export default Component;