import React from 'react'
import Ux from 'ux'
import {AttrSetter, AttrTree, PageCard} from 'web';
import ViewMarkdown from './UI.Markdown';
import ViewJson from './UI.Json';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {
            children,
            $source = [],   // Json内容
            $markdown = [], // Markdown内容
            $configuration = {},    // 属性配置
            reference, // 父引用
        } = this.props;
        return (
            <PageCard reference={this}>
                {Ux.auiTab(this)
                    .mount("type", "card")
                    .to(
                        <div className={"demo-window"}>
                            {children}
                            <AttrSetter reference={reference}/>
                        </div>,
                        <ViewJson key={"tabJson"} $source={$source}/>,
                        <ViewMarkdown key={"tabMarkdown"} $markdown={$markdown}/>,
                        <AttrTree $configuration={$configuration} $name={$configuration.code}/>
                    )}
            </PageCard>
        )
    }
}

export default Component