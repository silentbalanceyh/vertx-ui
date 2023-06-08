import React from 'react';
import Ux from "ux";
import {LoadingAlert} from 'web';
import Op from './Op';
import {Table} from "antd";

import Rdr from "../form/Web";
import Col from './Web.Column';

@Ux.zero(Ux.rxEtat(require('../Cab.json'))
    .cab("UI.List.Doc")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        const state = {};
        Op.yiList(this, state, Col.renderActionDoc)
            .then(Ux.ready)
            .then(Ux.pipe(this));
    }

    render() {
        const {$table = {}} = this.state;
        const {$spinning = false, data = [], $directory} = this.props;
        if ($directory) {
            const scroll = Ux.toHeightStyle(278);
            const table = Ux.clone($table);
            table.scroll = {
                y: scroll.minHeight,
                x: "max-content"
            };
            table.loading = $spinning;
            /*
             * 选择的数据是否支持写入操作，当前目录必须支持写操作/执行操作，
             * 子目录才可以执行其他操作
             */
            Op.yoRowSelection(table, this, false);
            return (
                <div>
                    <Table {...table} dataSource={data}/>
                    {
                        /*
                         * 表格中窗口（该窗口不能放到 Dropdown 中，也不可以放到 render 初始化中）
                         * 1. 如果将窗口放到 Drop 下拉菜单中，会导致点击关闭时候无法刷新
                         * 2. 同样，将窗口放到 Column 的 render 中也会导致点击关闭时无法刷新
                         *
                         * 最终将窗口放到外层可触发刷新，核心状态属性
                         * {
                         *     "$visible": "窗口隐藏",
                         *     "$inited": "表单核心数据"
                         * }
                         **/
                    }
                    {Rdr.renderEdit(this)}
                </div>
            );
        } else {
            const alert = Ux.fromHoc(this, "alert");
            return (<LoadingAlert $alert={alert}/>)
        }
    }
}

export default Component