import React from 'react';
import './Cab.less';
import G6Editor from '@antv/g6-editor';
import Bridge from '../Bridge';
import Rdr from './UI.Render';
import Fn from '../Util';

G6Editor.track(false);
// 注册自定义节点
const Util = G6Editor.Util;
G6Editor.Koni.registerNode('graph-model', {
    draw(item) {
        const group = item.getGraphicGroup();
        const label = this.drawLabel(item);
        const keyShape = this.drawKeyShape(item);
        this.drawIcon(item);
        label && Util.toFront(label, group);
        return keyShape;
    },
    drawIcon(item) {
        const group = item.getGraphicGroup();
        const model = item.getModel();
        const {icon} = model;

        group.addShape('image', {
            attrs: {
                x: -24,
                y: -24,
                img: icon
            }
        });
    }
});
const {Editor, ToolBar, ContextMenu, ItemPanel, DetailPanel, Navigator, Page} = Bridge;
export default class Component extends Editor {

    render() {
        const {curZoom, minZoom, maxZoom, selectedModel = {}} = this.state;
        // 从属性中读取（上层传入）
        const {
            $items = [],    // Item专用（左边的元素数据）
            $config = {},   // 上传传入的配置信息
            $components = {}
        } = this.props;
        const {$toolbars = {}, $detail = {}} = $config;
        return (
            <div className={"web-editor"}>
                {/* 工具栏定义 */}
                <ToolBar editor={this.editor} config={$toolbars}/>
                <div style={{height: '42px'}}/>
                <div className={'bottom-container'}>
                    {/* 右键菜单 */}
                    <ContextMenu editor={this.editor}/>
                    {/* 元素界面 */}
                    <ItemPanel
                        editor={this.editor}
                        createItempanel={Rdr.jsxItem}
                        content={Rdr.jsxContent($items)}
                    />
                    <DetailPanel editor={this.editor} config={$detail}
                                 components={$components}
                                 selected={selectedModel}/>
                    <Navigator
                        editor={this.editor}
                        curZoom={curZoom}
                        minZoom={minZoom}
                        maxZoom={maxZoom}
                        changeZoom={this.changeZoom.bind(this)}/>
                    <Page editor={this.editor}
                          createPage={container => {
                              const height = Fn.initHeight();
                              return new G6Editor.Koni({
                                  graph: {
                                      container,
                                      height
                                  },
                                  align: {
                                      grid: true
                                  }
                              });
                          }}
                    />
                </div>
            </div>
        );
    }
}