import React from 'react';
import Yo from '../yo';
import Ex from 'ex';
import Ux from 'ux';
import {List, Spin} from "antd";

import renderTool from './Web.Main.Form.Tool';
import renderItem from './Web.Main.Form.Item';

@Ux.zero(Ux.rxEtat(require('../Cab.json'))
    .cab("UI.FormList")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Yo.yiFormList(this)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Yo.yuFormList(this, {
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