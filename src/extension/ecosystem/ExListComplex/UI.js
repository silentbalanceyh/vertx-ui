import React from 'react';
import Op from './Op';
import Ex from 'ex';
import renderJsx from './Web.jsx';

/*
 * React属性props:
 * {
 *      $app: DataObject - X_APP 应用程序数据,
 *      $router: DataRouter - （react-router）构造对象,
 *      $user: DataArray - 登录的用户基本数据,
 *      fnOut: 专用 redux 写树函数,
 *      config:{
 *          query: （静态默认 query，主要包含四个键：projection, pager, sorter, criteria）,
 *          options: （选项处理）,
 *          mock: {},
 *          component: {},
 *          table: {}
 *      },
 *      $query：从外层传入的查询条件
 *
 *      rxInject: 注入函数用于修改 options（工具专用）
 *      rxSearch: 函数用于调用搜索方法，传入参数
 * }
 * React状态state:
 * {
 *      options: （原始选项）
 *      query：（核心query）
 *      $submitting: 提交
 *      $loading：加载
 * }
 * 步骤处理：
 * 0. Verify
 *    ./specification/verify.js
 * 1. Init
 *    ./specification/workflow.js
 * React往下传入配置
 */

class Component extends React.PureComponent {
    state = {
        // $loading: false,        // 数据加载
        // $submitting: false,     // 表单提交
        $ready: false,
        /*
         * 列表状态和值
         */
        $view: "list",         // 当前列表类型
        $key: undefined,       // 默认无（第一次会初始化）
        /*
         * 底层 Table 选中项
         */
        $selected: [],         // 底层选中项
        $condition: {},        // 条件设置项，默认 Object
        /*
         * 当前组件需要生成的 fn函数集
         */
    };

    componentDidMount() {
        /* Promise处理 */
        Op.yiList(this).then(state => this.setState(state));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuList(this, {prevProps, prevState});
    }

    render() {
        return Ex.yoRender(this, () => {
            const {tabs = {}} = this.state;
            /*
             * 当前组件不调用 ExTab 来处理 Tab
             * 页签行为，而是直接使用 antd 中的 Tabs，主要是防止和原始的
             * ComplexList / ExListComplex 产生冲突
             */
            return renderJsx(this, tabs);
        }, Ex.parserOfColor("ExListComplex").list())
    }
}

export default Component;