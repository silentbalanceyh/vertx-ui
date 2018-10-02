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
    componentDidMount() {
        // 处理禁用的情况
        Op.initDynamic(this);
    }

    render() {
        const {
            children,
            $source = [],   // Json内容
            $markdown = [], // Markdown内容
            $configuration = {}, // 属性配置
            // $diagram = {}, // 数据流结构图
            $datalist = {}, // 全属性表（分组件清单）
            $datatree = {}, // 文件树
            $title = "", // 标题：可动态变更
            // $tool = [], // 被禁用的工具栏
        } = this.props;
        // 说明信息
        //const graphicData = Ux.clone($diagram);
        //const tableSub = Ux.fromHoc(this, "table");
        const {
            $drawer,
        } = this.state;
        // 处理jsx
        const {tabs = {}} = this.state;
        const jsx = [];
        jsx.push(<div key="tabEffect" className={"demo-window"}>{children}</div>);
        jsx.push(<ViewJson key={"tabJson"} $source={$source}/>);
        if (tabs.jsx && 0 < tabs.jsx.length) {
            tabs.jsx.forEach(fn => jsx.push(fn()));
        } else {
            jsx.push(<ViewMarkdown key={"tabMarkdown"} $datalist={$datalist}
                                   $datatree={$datatree} $markdown={$markdown}/>);
            jsx.push(<AttrTree key={"tabAttribute"} $configuration={$configuration}
                               $name={$configuration.code}/>)
        }
        return (
            <PageCard reference={this} $title={$title}>
                {Ux.auiTab(this)
                    .connect(tabs.tabs)   // 添加filter中的信息
                    .add(tabs.children)   // 添加tab
                    .onChange(($_tabIndex) => this.setState({$_tabIndex}))
                    .type("card")
                    .to(jsx)}
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