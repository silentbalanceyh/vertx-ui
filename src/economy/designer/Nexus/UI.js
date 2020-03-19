import React from 'react';
import Editor, {Flow, Item, ItemPanel} from "editor";
import './Cab.less';
import {Tooltip} from 'antd';
import {Grid} from '@antv/g6/build/plugins';

const initData = {
    // 点集
    nodes: [{
        id: 'node1', // 节点的唯一标识
        label: '起始点' // 节点文本
    }, {
        id: 'node2',
        label: '目标点'
    }],
    // 边集
    edges: [
        // 表示一条从 node1 节点连接到 node2 节点的边
        {
            source: 'node1',  // 起始点 id
            target: 'node2',  // 目标点 id
            label: '我是连线'   // 边的文本
        }
    ]
};

class Component extends React.PureComponent {

    render() {
        const {items = [], config = {}, graphConfig = {}} = this.props;
        /*
         * 网格插件
         */
        const grid = new Grid();
        const $graphConfig = {
            ...graphConfig,
            plugins: [grid],
            layout: {
                type: 'fruchterman',
                preventOverlap: true,
                linkDistance: 144
            }
        };
        return (
            <Editor className={"ex-nexus"}>
                <div className={"ex-nexus-hd"}>
                    <ItemPanel className={"box"} style={{
                        maxHeight: config.maxHeight ? config.maxHeight : 600
                    }}>
                        {items.map(each => {
                            return (
                                <Item {...each.item}>
                                    <Tooltip title={each.text} placement={"leftTop"}>
                                        <img alt={each.img.alt} {...each.img}/>
                                        <label>{each.text}</label>
                                    </Tooltip>
                                </Item>
                            )
                        })}
                    </ItemPanel>
                </div>
                <Flow className={"ex-nexus-bd"}
                      data={initData}
                      graphConfig={$graphConfig}/>
            </Editor>
        );
    }
}

export default Component;