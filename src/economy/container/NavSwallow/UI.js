import React from 'react';
import './Cab.less';

class Component extends React.PureComponent {
    render() {
        const {
            $steps = [],
            $current = 0,
            $common = true
        } = this.props;

        let startCls = `step ${$common ? `start-common` : ""}`;
        let endCls = $common ? `step-middle` : "start-end";
        return (
            <div className={"web-nav-swallow"}>
                {$steps.map((step, index) => {
                    let className = $current === index ? 'step-active' : '';
                    if (0 === index) {
                        // 起点
                        className = startCls + ' ' + className;
                    } else if (($steps.length - 1) === index) {
                        // 结束点
                        className = endCls + ' ' + className;
                    } else {
                        // 中间点
                        className = `step-middle ` + className;
                    }
                    return (
                        <div className={className} key={`step${index}`}>
                            {step.title}
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Component