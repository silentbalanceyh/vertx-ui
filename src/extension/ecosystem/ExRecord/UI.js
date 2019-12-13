import React from 'react';
import Ex from 'ex';
import Op from './Op';
import {ExForm} from "ei";

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Op.yiPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuPage(this, {props: prevProps, state: prevState});
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$config = {}, $inited = {}} = this.state;
            const {$op = {}} = this.props;
            const form = Ex.yoForm(this,
                {form: $config},
                $inited);
            /*
             * 多一阶函数
             */
            return (
                <ExForm {...form} $height={"300px"} $op={$op}/>
            )
        }, Ex.parserOfColor("ExRecord").component())
    }
}

export default Component;