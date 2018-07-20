import React from 'react';
import './UI.Toolbar.css';

class UIToolbar extends React.Component {
    render() {
        return (
            <div id="toolbar">
                <link rel="stylesheet" type="text/css" href="//at.alicdn.com/t/font_598462_3xve1872wizzolxr.css"/>
                <i data-command="undo" className="command iconfont icon-undo" title="撤销"/>
                <i data-command="redo" className="command iconfont icon-redo" title="重做"/>
                <span className="separator"/>
                <i data-command="copy" className="command iconfont icon-copy-o" title="复制"/>
                <i data-command="paste" className="command iconfont icon-paster-o" title="粘贴"/>
                <i data-command="delete" className="command iconfont icon-delete-o" title="删除"/>
                <span className="separator"/>
                <i data-command="zoomIn" className="command iconfont icon-zoom-in-o" title="放大"/>
                <i data-command="zoomOut" className="command iconfont icon-zoom-out-o" title="缩小"/>
                <i data-command="autoZoom" className="command iconfont icon-fit" title="适应画布"/>
                <i data-command="resetZoom" className="command iconfont icon-actual-size-o" title="实际尺寸"/>
                <span className="separator"/>
                <i data-command="toBack" className="command iconfont icon-to-back" title="层级后置"/>
                <i data-command="toFront" className="command iconfont icon-to-front" title="层级前置"/>
                <span className="separator"/>
                <i data-command="multiSelect" className="command iconfont icon-select" title="多选"/>
                <i data-command="addGroup" className="command iconfont icon-group" title="成组"/>
                <i data-command="unGroup" className="command iconfont icon-ungroup" title="解组"/>
            </div>
        );
    }
}

module.exports = UIToolbar;
