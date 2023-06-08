import React from 'react';
import Ux from 'ux';
import Ex from "ex";
import {HocI18r} from "entity";
import Op from "./Op";
import {ExForm} from "ei";
import {PageCard} from 'web';

const componentInit = (reference) => {
    const state = {};
    const key = Ux.toQuery("bag");
    return Ux.parallel([
        Ux.ajaxGet("/api/bag/config/:key", {key}),
        Ux.ajaxGet("/api/bag/data/:key", {key})
    ], "ui", "data").then(response => {
        const {ui = {}, data = {}} = response;
        if (Ux.isEmpty(ui)) {
            // Error-1：配置为空
            state.$error = Ux.fromHoc(reference, "error");
            return Ux.promise(state);
        }
        const {bag = {}, store, config = {}} = ui;
        {
            // Configuration
            state.$bagData = Ux.clone(bag);

            // bags to map
            const {children = [], ...rest} = bag;
            const bagMap = {};
            if (Ux.isEmpty(rest)) {
                // Error-2：没有根模块配置
                state.$error = Ux.fromHoc(reference, "error");
                return Ux.promise(state);
            }

            const info = Ux.fromHoc(reference, "info")
            bagMap[rest['nameAbbr']] = rest;

            children.forEach(each => {
                const bagJ = Ux.clone(each);
                bagJ.subject = `${bagJ.name}${info.parameter}`;
                bagMap[each['nameAbbr']] = bagJ;
            });
            state.$subject = bagMap;
            state.$configKey = store;

            const {$hoc} = reference.state;
            if ($hoc) {
                /* 混合模式 */
                state.$hoc = $hoc.merge(config);
            } else {
                state.$hoc = new HocI18r(config);
            }
        }
        state.$inited = Ux.valueSTDN(data);
        // config to hoc
        state.$error = undefined;
        return Ux.asyncAssist(config._assist, reference, state)
    }).then(Ux.ready).then(Ux.pipe(reference))
        .catch(error => //reference.?etState({$error: error})
            Ux.of(reference).in({$error: error}).done()
        );
}

const componentUp = (reference, virtual = {}, callbackFn = {}) => {
    const router = reference.props.$router;
    const prev = virtual.props.$router;
    if (router && prev) {
        const cFlow = router._("bag");
        const pFlow = prev._("bag");
        if (cFlow !== pFlow) {
            Ux.of(reference).readying().handle(() => {
                callbackFn();
            })
            // reference.?etState({$ready: false});
            // callbackFn();
        }
    }
}

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {
            props: prevProps,
            state: prevState
        }, () => componentInit(this))
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$error} = this.state;
            if ($error) {
                return Ux.aiErrorPage($error);
            } else {
                // 正式渲染
                const {$inited = {}} = this.state;
                const form = Ex.yoForm(this, null, Ux.clone($inited));
                return (
                    <PageCard reference={this}>
                        <ExForm {...form} $height={"200px"}
                                $op={Op.actions(this)}/>
                    </PageCard>
                );
            }
        }, Ex.parserOfColor("PxModulat").page());
    }
}

export default Component