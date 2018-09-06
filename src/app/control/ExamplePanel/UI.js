import React from 'react'
import Ux from 'ux'
import {AttrTree, PageCard} from 'web';
import {Button} from 'antd';
import ViewMarkdown from './UI.Markdown';
import ViewJson from './UI.Json';
// 抽屉
import Setting from './drawer/UI.Setting';
import Op from './Op'

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .state({
        $drawer: false,
        $connect: false,
        $_tabIndex: "tabEffect"
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
            $drawer
        } = this.state;
        return (
            <PageCard reference={this}>
                {Ux.auiTab(this)
                    .mount("onChange", ($_tabIndex) => this.setState({$_tabIndex}))
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
                <Button id={"$opSetting"} onClick={Op.Tool.setting(this)}/>
            </PageCard>
        )
    }
}

export default Component