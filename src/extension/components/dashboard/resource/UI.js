import React from 'react';
import {ProCard, StatisticCard} from '@ant-design/pro-components';
import Ex from 'ex';
import UiApp from './UI.App';
import Sk from 'skin';
import __ from './Cab.module.scss';
import Ux from 'ux';
import Rdr from './Web';

const renderContent = (reference) => {
    const config = Ux.inConfig(reference);
    const {dim = {}, typed = {}} = config;
    return (
        <ProCard split={"vertical"}>
            <ProCard split={"horizontal"} title={config.title}>
                {Object.keys(dim).map(key => (
                    <StatisticCard key={key} statistic={{
                        value: dim[key].count,
                        title: dim[key].text,
                    }}/>
                ))}
            </ProCard>
            <ProCard title={typed.text}>
                {Rdr.renderBar(reference)}
            </ProCard>
        </ProCard>
    )
}

const componentInit = (reference) => {
    Ex.yiAssist(reference).then(state => {
        Ux.ajaxPost("/api/x-log/search").then(response => {
            state.$log = Ux.valueArray(response);
            return Ux.promise(state);
        }).then(state => {
            let sumCount = 12;
            const dimdata = {change: 3, task: 4, op: 2, system: 3};
            const typeddata = {error: 3, warn: 7, info: 2};
            state.$log.forEach(log => {
                // 日志统计逻辑
                sumCount += 1;
            })
            const config = Ux.inConfig(reference);
            const {dim = {}, typed = {}, pie = []} = config;
            Object.keys(dim).map(key => {
                dim[key].count = dimdata[key]
            })
            for (let key in typed.type) {
                pie.push({
                    key: key,
                    name: typed['type'][key],
                    value: typeddata[key],
                    ratio: typeddata[key] && sumCount > 0 ? (typeddata[key] / sumCount).toFixed(4) : 0
                });
            }
            state.config = config;
            state.pie = pie;
            return Ux.promise(state);
        }).then(Ux.ready).then(Ux.pipe(reference));
    })
}

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this)
    }

    render() {
        const attrPage = Sk.mix(__.upg_dashboard_resource);
        const inherit = Ex.yoAmbient(this);
        return (
            <div {...attrPage}>
                <div className={"resource_container"}>
                    <ProCard split={"horizontal"}>
                        <UiApp {...inherit}/>
                    </ProCard>
                </div>
                <div className={"resource_container"}>
                    <ProCard split={"horizontal"}>
                        {renderContent(this)}
                    </ProCard>
                </div>
            </div>
        )
    }
}

export default Component