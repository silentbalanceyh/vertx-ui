import React from 'react';
import Ex from 'ex';
import Op from './Op';
import {ExListComplex} from 'ei';
import Ux from 'ux';
import Plugin from 'plugin';

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        Op.yiModule(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {config = {}, $record = {}} = this.props;  // 基本配置
            let $config = Ux.clone(config);
            if ($config.options) {
                // 动静切换（由于OxList外置已经处理过 Op了，所以此处仅强制 dynamic.op = false;
                $config.options[Ex.Opt.DYNAMIC_OP] = false;
                // 编辑按钮在 EXTRA 中不呈现
                $config.options[Ex.Opt.TABS_EXTRA_EDIT] = false;
            }
            const {$form = {}, $tree = []} = this.state;   // 表单配置
            const inherit = Ex.yoDynamic(this); // 新方法
            /*
             * 处理 $config 中的 $query
             */
            $config = Op.yoQuery(this, $config);
            /*
             * pluginField 转入 ExListComplex
             */
            return (
                <ExListComplex {...inherit}
                               config={$config}
                               $form={$form}            // 增删改专用Form注入
                               $record={$record}        // 复杂表单专用的记录，替换 $inited 的第二原始数据
                               $forbidden={$config.$forbidden} // 关闭 options 专用
                               $query={$config.query}   // 外置专用的 query 读取
                               $tree={$tree}
                               pluginField={Plugin.pluginField}
                               rxPostSelected={Op.rxPostSelected(this)}
                               rxPostOpen={() => Ux.activeTreeOff()}
                               rxPostClose={() => Ux.activeTreeOn()}
                />
            );
        }, Ex.parserOfColor("OxList").list());
    }
}

export default Component;