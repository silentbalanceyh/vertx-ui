import React from 'react';
import Op from "./Op";
import Ux from 'ux';
import {Input, Spin, Tree} from "antd";
import {Dialog} from "web";

/**
 * ## 「组件」`TreeSelector`
 *
 *树选择器
 *
 * ```js
 * import { TreeSelector } from 'web';
 * ```
 *
 * ### 0. 示例
 *
 * ```json
 * {
 *      "metadata": "source,导入数据源,10,,aiTreeSelector,placeholder=（选择数据源）",
 *      "optionJsx.config": {
 *          "ajax": {
 *              "uri": "/api/search/data-source"
 *          },
 *          "selection": {
 *              "checkStrictly": true,
 *              "multiple": true,
 *              "showLine": false,
 *              "display": "name",
 *              "limitOp": "LE",
 *              "limitConfig": {
 *                  "_level": 1
 *              }
 *          },
 *          "tree": {
 *              "title": "name"
 *          },
 *          "validation": "请选择数据源！",
 *          "window": "选择导入数据源,选择,取消,false,400,false"
 *      },
 *      "optionJsx.allowClear": true,
 *      "optionConfig.rules": [
 *          "required,请选择导入数据源"
 *      ]
 * }
 * ```
 *
 *  ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|Ok|
 *
 * ### 2. 属性说明
 *
 * 该属性说明位于`optionJsx.config`节点中，即`jsx`中的`config`对象信息。
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |value||props|Object|Ant Form给当前组件传入的值。|
 * |config|ajax|props|Object|带表达式的Ajax请求专用配置。|
 * |config|linker|props|Object|当前选择数据和表单之间的链接配置（linker）。|
 * |config|tree|props|Object|当前列表选择器中表格`<Tree/>`的配置。|
 * |config|validation|props|String|选择验证器，验证是否选择了记录。|
 * |config|window|props|String/Object|弹出窗口专用配置信息。|
 * |config|selection|props|Object|多选还是单选的控制。|
 * |dialog||state|Object|「直接使用」处理过的窗口配置。|
 * |tree||state|Object|「直接使用」处理过的树配置。|
 * |search||state|Object|「直接使用」开启搜索框操作。|
 * |$visible||state|Boolean|是否显示弹出框。|
 * |$loading||state|Boolean|是否执行提交操作，造成加载效果。|
 * |$data||state|Array|当前组件中拥有的表格数据。|
 * |$keySet||state|Any|选中数据的组件集合。|
 * |$ready||state|Boolean|标识当前组件已经加载完成。|
 * |onClick||state|Function|点击函数构造。|
 *
 * ### 3. 组件核心点
 *
 * （略）
 *
 * @memberOf module:web-input
 * @method TreeSelector
 */
// =====================================================
// componentInit/componentUp
// =====================================================
class Component extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = Op.yiDefault(this);
    }

    componentDidMount() {
        Ux.xtLazyInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Ux.xtLazyUp(this, {props: prevProps, state: prevState});
    }

    render() {
        const {config = {}, ...jsx} = this.props;
        const {
            onClick, dialog,
            $data = [], tree = {},
            $loading = false,
        } = this.state ? this.state : {};
        jsx.onClick = onClick;
        const inputAttrs = Op.yiValue(this, jsx);
        const treeData = Ux.toTree($data, config.tree);

        /*
         * selectable
         */
        Op.yoTreeData(this, treeData);
        /*
         * 根据
         * tree
         * treeData
         */
        const treeAttrs = Op.yoTree(this, tree, treeData);

        /*
         * 处理输入框属性
         */
        const inputCombine = Op.yoCombine(this, inputAttrs);
        return (
            <div>
                <Input {...inputCombine}/>
                <Dialog className="web-dialog"
                        size={"small"}
                        $visible={this.state['$visible']}   // 窗口是否开启
                        $dialog={dialog}>
                    <Spin spinning={$loading}>
                        <div style={{
                            overflow: "auto",
                            minHeight: 300,
                            maxHeight: 450
                        }}>
                            <Tree {...treeAttrs}/>
                        </div>
                    </Spin>
                </Dialog>
            </div>
        );
    }
}

export default Component;