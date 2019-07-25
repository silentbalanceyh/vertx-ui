import React from 'react';

/*
 * React中的props属性
 * {
 *      $app: DataObject - X_APP 应用程序数据,
 *      $router: DataRouter - （react-router）构造对象,
 *      $user: DataArray - 登录的用户基本数据,
 *      fnOut: 专用 redux 写树函数,
 *      config = {
 *          窗口专用配置
 *      },
 *      children = 子组件（直接外层放到子组件中的内容）
 *      $visible = false：当前窗口的显示和隐藏
 *      $submitting = false：当前窗口是否处于提交过程
 * }
 * React属性state：
 * {
 *      $ready: "当前组件是否满足渲染",
 *      $visible: "窗口是否隐藏"
 * }
 */
class Component extends React.PureComponent {
    render() {
        return (
            <div>
                Component
            </div>
        );
    }
}

export default Component;