import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import {List, Spin} from "antd";
import Form from "../form/UI.Form";

import renderTool from './Web.Main.Form.Tool';
import renderItem from './Web.Main.Form.Item';

const componentInit = (reference) => {
    const {$identifier} = reference.props;
    if ($identifier) {
        const state = {};
        Ex.I.forms($identifier).then(forms => {
            state.$data = forms;
            state.$ready = true;
            /*
             * 窗口配置
             */
            Ex.uiDialog(reference).child(() => {
                const {$inited = {}} = reference.state;
                return (<Form {...Ex.yoAmbient(reference)} $inited={$inited}/>)
            }).onMount(state);
            Ux.of(reference).in(state).done();
            // reference.?etState(state);
        })
    } else {
        const state = {};
        state.error = `Error to read form configuration, the "$identifier" is null, could not get forms.`;
        Ux.of(reference).in(state).done();
        // reference.?etState(state);
    }
}

const componentUp = (reference, virtualRef) => {
    const current = reference.props.$identifier;
    const previous = virtualRef.props.$identifier;
    if (current !== previous) {
        Ux.of(reference).readying().handle(() => {
            Ex.I.forms(current).then(forms => {
                const state = {};
                state.$data = forms;
                Ux.of(reference).in(state).ready().done();
                // state.$ready = true;
                // reference.?etState(state);
            })
        }, 24)
        // reference.?etState({$ready: false});
        // Ux.toLoading(() => Ex.I.forms(current).then(forms => {
        //     const state = {};
        //     state.$data = forms;
        //     Ux.of(reference).in(state).ready().done();
        //     // state.$ready = true;
        //     // reference.?etState(state);
        // }), 24);
    }
};

@Ux.zero(Ux.rxEtat(require('../Cab.json'))
    .cab("UI.FormList")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {
            props: prevProps,
            state: prevState
        })
    }

    render() {
        return Ex.yoRender(this, () => {
            const {__dialog, $loading = false} = this.state;
            const toolbar = Ux.fromHoc(this, "toolbar");
            const {callback = {}} = toolbar;
            return (
                <div>
                    {renderTool(this, toolbar)}
                    {__dialog.render()}
                    <Spin tip={callback.loading} spinning={$loading}>
                        {(() => {
                            const {$data = [], $searchText} = this.state;
                            let filtered = Ux.clone($data);
                            if ($searchText) {
                                filtered = filtered.filter(each => 0 <= each.name.indexOf($searchText))
                            }
                            return (
                                <List dataSource={filtered}
                                      pagination={{
                                          size: "small",
                                          pageSize: 6
                                      }}
                                      style={{
                                          minHeight: Ux.toHeight(148)
                                      }}
                                      className={"ext-list"}
                                      renderItem={item => renderItem(this, item)}/>
                            )
                        })()}
                    </Spin>
                </div>
            );
        }, Ex.parserOfColor("PxFormList").list())
    }
}

export default Component