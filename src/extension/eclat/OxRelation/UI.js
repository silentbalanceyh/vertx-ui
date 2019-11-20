import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {ExRelation} from "ei";

class Component extends React.PureComponent {
    render() {
        const {config = {}, $inited = {}} = this.props;
        const {category = {}, ...rest} = config;
        /*
         * 底层需要
         */
        const attrs = Ex.configRelation($inited, {category}, this);
        attrs.config = Ux.clone(rest);
        /*
         * 继承属性
         */
        const inherit = Ex.yoAmbient(this);
        return (
            <ExRelation {...inherit} {...attrs}/>
        );
    }
}

export default Component;