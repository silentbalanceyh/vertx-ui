import React from 'react'
import Ux from 'ux'
import {AttrTree, PageCard} from 'web';
import ViewMarkdown from './UI.Markdown';
import ViewJson from './UI.Json';
import ToolBar from './UI.Bar';
// 抽屉
import Setting from './drawer/UI.Setting';
import Connect from './drawer/UI.Connect';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .state({
        $drawer: false,
        $connect: false,
    })
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {
            children,
            $source = [],   // Json内容
            $markdown = [], // Markdown内容
            $configuration = {},    // 属性配置
            // $tool = [], // 被禁用的工具栏
        } = this.props;
        const {
            $drawer,
            $connect
        } = this.state;
        return (
            <PageCard reference={this}>
                <ToolBar reference={this}/>
                {Ux.auiTab(this)
                    .mount("type", "card")
                    .to(
                        <div className={"demo-window"}>
                            {children}
                        </div>,
                        <ViewJson key={"tabJson"} $source={$source}/>,
                        <ViewMarkdown key={"tabMarkdown"} $markdown={$markdown}/>,
                        <AttrTree $configuration={$configuration} $name={$configuration.code}/>
                    )}
                <Setting $visible={$drawer} reference={this}/>
                <Connect $visible={$connect} reference={this}/>
            </PageCard>
        )
    }
}

export default Component