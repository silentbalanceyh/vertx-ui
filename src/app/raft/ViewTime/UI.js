import React from 'react';

import Ux from 'ux';

/*
 * 运营日期专用显示组件，无日期
 * 时则直接显示当前日期
 */
@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const params = Ux.isMod("mZo");
        const info = Ux.fromHoc(this, "info");

        let timeRunning = params['pTimeRunning'];
        if (!timeRunning) {
            timeRunning = Ux.valueNow()
        }
        return (
            <div className={"ht-view-time"}>
                {info.title}
                ：
                {Ux.formatDate(timeRunning, info.pattern)}
            </div>
        )
    }
}

export default Component