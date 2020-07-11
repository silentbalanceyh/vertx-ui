import React from 'react'
import {Form} from 'antd';
import Ex from "ex";
import Ux from 'ux';

/*
 * React属性props：
 * {
 *      $app: DataObject - X_APP 应用程序数据,
 *      $router: DataRouter - （react-router）构造对象,
 *      $user: DataArray - 登录的用户基本数据,
 *      fnOut: 专用 redux 写树函数,
 *      form: Ant-Design Form,
 *      $actions: {
 *          $opProfile ( id = opProfile, function = $opProfile )
 *      },
 *      config:{
 *          dialog: {
 *              modal: { 窗口数据 }
 *              title: { 窗口标题 }
 *          },
 *          form: {
 *              原始配置 _form 中的内容
 *          }
 *      },
 *      $height: "200px",
 *      $inited: {
 *          初始值
 *      }
 * }
 * React属性state:
 * {
 *      $ready: "当前组件是否可渲染？配置处理完成",
 *      $loading: "当前表单提交状态（防重复提交）",
 *      $metadata: {}
 *      $action: {
 *          opProfile: true ( id = opProfile )
 *      },
 *      raft: {
 *          enabled: 启用Raft表单模式,
 *          form:{ },
 *          hidden: { inputs:[] },
 *          options: { },
 *          rows: [
 *              []
 *          ]
 *      }
 * }
 */

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Ux.raftForm(this).then(Ux.ready).then(Ux.pipe(this));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /*
         * 必须要传入了 $refresh 的时候才会生效
         * 如果没有传入 $refresh 时，这个过程不生效
         */
        if (this.props.hasOwnProperty("$refresh")) {
            const $checked = Ex.upValue(this.props, prevProps, "$refresh");
            if ($checked) {
                /*
                 * 如果检测到变更，则需要按照 $inited 中的值重新刷新表单数据
                 * 并且在刷新的时提供 undefined 值
                 */
            }
        }
    }

    render() {
        return Ex.yoRender(this, () =>
                Ux.aiForm(this),
            Ex.parserOfColor("ExForm").form())
    }
}

export default Form.create({})(Component)