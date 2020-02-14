import React from 'react';
import Ex from 'ex';
import {ExRelation} from "ei";
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
            return (
                <ExRelation {...inherit} {...attrs}/>
            );
        }, Ex.parserOfColor("OxTab").component())
    }
}

export default Component;