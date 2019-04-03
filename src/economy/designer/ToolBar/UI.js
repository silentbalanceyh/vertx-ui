import React from 'react';
import './Cab.less';
import UD from '../Util';
import {Divider, Tooltip} from 'antd';

class Component extends React.PureComponent {

    componentDidMount() {
        UD.mountComponent(this,
            () => UD.initComponent(this, 'createToolbar'),
            this.toolbarContainer
        );
    }

    render() {
        const {config = {}} = this.props;
        /**
         * 关于工具栏不使用迭代模式的说明：
         * 最开始，config是一个数组，使用了类似 config.map 的方式来迭代处理工具栏中的每一个工具，
         * 但是使用了这种模式过后，会导致 data-command 的内置命令不可用，也就是说这里是强行使用了
         * 硬编码模式，一个工具一个工具地绘制。
         * 原始代码如：
         * {config.map(toolbar => {
                if (toolbar.divider) {
                    return (
                        <Divider key={toolbar.key} type={"vertical"}/>
                    );
                } else {
                    return _renderCommand(toolbar);
                }
            })}
         * 如果使用了上述代码，会导致 data-command 不可用，目前没找到原因，所以仅仅抽取了中文字的部分
         * 并且使用Antd中的 Tooltip 封装，来实现文字的浮游提示。
         */
        return (
            <div className="toolbar" ref={el => {
                this.toolbarContainer = el;
            }}>
                <Tooltip overlayClassName={'tooltip'} placement={'bottom'}
                         title={config['undo']}>
                    <i data-command="undo"
                       className="command iconfont icon-undo"
                       title={config['undo']}/>
                </Tooltip>
                <Tooltip overlayClassName={'tooltip'} placement={'bottom'}
                         title={config['redo']}>
                    <i data-command="redo"
                       className="command iconfont icon-redo"
                       title={config['redo']}/>
                </Tooltip>
                <Divider type={'vertical'}/>
                <Tooltip overlayClassName={'tooltip'} placement={'bottom'}
                         title={config['copy']}>
                    <i data-command="copy"
                       className="command iconfont icon-copy-o"
                       title={config['copy']}/>
                </Tooltip>
                <Tooltip overlayClassName={'tooltip'} placement={'bottom'}
                         title={config['paste']}>
                    <i data-command="paste"
                       className="command iconfont icon-paster-o"
                       title={config['paste']}/>
                </Tooltip>
                <Tooltip overlayClassName={'tooltip'} placement={'bottom'}
                         title={config['delete']}>
                    <i data-command="delete"
                       className="command iconfont icon-delete-o"
                       title={config['delete']}/>
                </Tooltip>
                <Divider type={'vertical'}/>
                <Tooltip overlayClassName={'tooltip'} placement={'bottom'}
                         title={config['zoomIn']}>
                    <i data-command="zoomIn"
                       className="command iconfont icon-zoom-in-o"
                       title={config['zoomIn']}/>
                </Tooltip>
                <Tooltip overlayClassName={'tooltip'} placement={'bottom'}
                         title={config['zoomOut']}>
                    <i data-command="zoomOut"
                       className="command iconfont icon-zoom-out-o"
                       title={config['zoomOut']}/>
                </Tooltip>
                <Tooltip overlayClassName={'tooltip'} placement={'bottom'}
                         title={config['autoZoom']}>
                    <i data-command="autoZoom"
                       className="command iconfont icon-fit"
                       title={config['autoZoom']}/>
                </Tooltip>
                <Tooltip overlayClassName={'tooltip'} placement={'bottom'}
                         title={config['resetZoom']}>
                    <i data-command="resetZoom"
                       className="command iconfont icon-actual-size-o"
                       title={config['resetZoom']}/>
                </Tooltip>
                <Divider type={'vertical'}/>
                <Tooltip overlayClassName={'tooltip'} placement={'bottom'}
                         title={config['toBack']}>
                    <i data-command="toBack"
                       className="command iconfont icon-to-back"
                       title={config['toBack']}/>
                </Tooltip>
                <Tooltip overlayClassName={'tooltip'} placement={'bottom'}
                         title={config['toFront']}>
                    <i data-command="toFront"
                       className="command iconfont icon-to-front"
                       title={config['toFront']}/>
                </Tooltip>
                <Divider type={'vertical'}/>
                <Tooltip overlayClassName={'tooltip'} placement={'bottom'}
                         title={config['multiSelect']}>
                    <i data-command="multiSelect"
                       className="command iconfont icon-select"
                       title={config['multiSelect']}/>
                </Tooltip>
                <Tooltip overlayClassName={'tooltip'} placement={'bottom'}
                         title={config['addGroup']}>
                    <i data-command="addGroup"
                       className="command iconfont icon-group"
                       title={config['addGroup']}/>
                </Tooltip>
                <Tooltip overlayClassName={'tooltip'} placement={'bottom'}
                         title={config['unGroup']}>
                    <i data-command="unGroup"
                       className="command iconfont icon-ungroup"
                       title={config['unGroup']}/>
                </Tooltip>
            </div>);
    }
}

export default Component;