import React from 'react'
import Ux from 'ux'
import {AttrTree, PageCard} from 'web';
import {Button} from 'antd';
import ViewMarkdown from './UI.Markdown';
import ViewJson from './UI.Json';
// 抽屉
import Setting from './drawer/UI.Setting';
import Op from './Op'
import DataFlow from "./UI.DataFlow";

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
            $configuration = {}, // 属性配置
            $diagram = {}, // 数据流结构图
            $datalist = {}, // 全属性表（分组件清单）
            $datatree = {}, // 文件树
            // $tool = [], // 被禁用的工具栏
        } = this.props;
        // 说明信息
        const graphicData = Ux.clone($diagram);
        const tableSub = Ux.fromHoc(this, "table");
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
                        <ViewJson key={"tabJson"}
                                  $source={$source}/>,
                        <ViewMarkdown key={"tabMarkdown"}
                                      $datalist={$datalist}
                                      $datatree={$datatree}
                                      $markdown={$markdown}/>,
                        <AttrTree
                            $configuration={$configuration}
                            $name={$configuration.code}/>,
                        <DataFlow key={Ux.randomUUID()}
                                  $source={graphicData}
                                  $table={tableSub}
                                  $current={$markdown.map(item => item.tab).filter(file => file.startsWith("UI"))}/>
                    )}
                <Setting $visible={$drawer}
                         reference={this}/>
                <Button id={"$opSetting"}
                        className={"ux-hidden"}
                        onClick={Op.Tool.setting(this)}/>
            </PageCard>
        )
    }
}

export default Component