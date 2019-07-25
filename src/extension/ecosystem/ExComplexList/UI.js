import React from 'react';
import Init from './Init';
import Ex from 'ex';
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
import ExTab from '../ExTab/UI';

class Component extends React.PureComponent {
    state = {
        $loading: false,        // 数据加载
        $submitting: false,     // 表单提交
    };

    componentDidMount() {
        Init.yiList(this);
    }

    render() {
        Ex.F.Log.list({
            props: this.props,
            state: this.state,
        }, false);
        return Ex.U.yxRender(this, () => {
            const {tabs = {}} = this.state;
            return (
                <ExTab {...this.props} {...Ex.U.yoTab(this, tabs)}/>
            )
        })
    }
}

export default Component;