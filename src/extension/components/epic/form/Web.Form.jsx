import React from 'react';
import Yo from './yo';
import Ex from 'ex';
import Ux from 'ux';
import {List} from "antd";
import renderTool from './Web.Fn.Tool';
import renderItem from './Web.Fn.Item';

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI.List")
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
            return (
                <div>
                    {renderTool(this)}
                    {(() => {
                        const {$data = [], $searchText} = this.state;
                        let filtered = Ux.clone($data);
                        if ($searchText) {
                            filtered = filtered.filter(each => 0 <= each.name.indexOf($searchText))
                        }
                        return (
                            <List dataSource={filtered}
                                  style={{
                                      minHeight: Ux.toHeight(148)
                                  }}
                                  className={"ext-list"}
                                  renderItem={item => renderItem(this, item)}/>
                        )
                    })()}
                </div>
            );
        }, Ex.parserOfColor("PxFormList").list())
    }
}

export default Component