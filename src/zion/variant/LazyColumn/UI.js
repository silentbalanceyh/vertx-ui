import React, {Fragment} from 'react';
import Op from './Op';
import __Zn from "../zero.uca.dependency";

// =====================================================
// componentInit/componentUp
// =====================================================

const yiValue = (reference, value = "", isPerson = false) => {
    const state = {};
    state.value = value;
    state.$ready = true;
    state.$system = !isPerson;
    __Zn.of(reference).in(state).ready().done();
    // reference.?etState(state);
};
const componentInit = (reference) => {
    const {config, $empty = "", $key} = reference.props;
    if (config) {
        const {uri, field, expr} = config;
        if (uri && $key) {
            __Zn.ajaxGet(uri, {key: $key})
                .then(result => {
                    if (__Zn.isEmpty(result)) {
                        yiValue(reference, $empty);
                    } else {
                        /*
                         * expr 专用，可支持表达式
                         */
                        if (expr) {
                            const value = __Zn.formatExpr(expr, result, true);
                            yiValue(reference, value, true);
                        } else {
                            const value = result[field];
                            yiValue(reference, value, true);
                        }
                    }
                })
                .catch(error => {
                    console.error(error);
                    yiValue(reference, $empty);
                })
        } else {
            yiValue(reference, $empty);
        }
    } else {
        yiValue(reference, $empty);
    }
};

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        componentInit(this);
    }

    render() {
        const {$ready = false, value = ""} = this.state;
        const {config = {}} = this.props;
        const {icon = true} = config;
        return $ready ? (
            <Fragment>
                {icon ? (__Zn.v4Icon(Op.yoIcon(this))) : false}
                &nbsp;&nbsp;
                {value}
            </Fragment>
        ) : __Zn.v4Icon("loading");
    }
}

export default Component;