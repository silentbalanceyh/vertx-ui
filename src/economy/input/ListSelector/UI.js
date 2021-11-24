import React from 'react';
import Ux from 'ux';
import {Col, Input, Row, Table} from "antd";
import Op from './Op';

import {Dialog} from 'web'; // 直接读取 Dialog 专用

/**
 * ## 「组件」`ListSelector`
 *
 * 列表选择器
 *
 * ```js
 * import { ListSelector } from 'web';
 * ```
 *
 * ### 0. 示例
 *
 * ```json
 * {
 *      "metadata": "username,关联账号,8,,aiListSelector,placeholder=（请选择账号）",
 *      "optionJsx.config": {
 *          "ajax": {
 *              "metadata": "POST,/api/user/search,1,10,sorter=updatedAt`DESC",
 *              "params.criteria": {
 *                  "modelId": "FIX:employee",
 *                  "": "OPERATOR:AND"
 *              }
 *          },
 *          "linker": {
 *              "key": "userId",
 *              "username": "username",
 *              "realname": "viceName",
 *              "email": "viceEmail",
 *              "mobile": "viceMobile"
 *          },
 *          "table": {
 *              "columns": [
 *                  "username,用户账号",
 *                  "realname,用户名称",
 *                  "mobile,手机号",
 *                  "email,邮箱"
 *              ]
 *          },
 *          "validation": "请选择关联账号！",
 *          "window": "关联账号,选择,关闭,false,800,false",
 *          "search": {
 *              "username,c": "账号",
 *              "realname,c": "姓名"
 *          }
 *      },
 *      "optionJsx.allowClear": true
 * }
 * ```
 *
 * ### 1. 生命周期
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
 * |config|table|props|Object|当前列表选择器中表格`<Table/>`的配置。|
 * |config|validation|props|String|选择验证器，验证是否选择了记录。|
 * |config|window|props|String/Object|弹出窗口专用配置信息。|
 * |config|search|props|Object|是否启用搜索项相关信息。|
 * |config|selection|props|Object|多选还是单选的控制。|
 * |dialog||state|Object|「直接使用」处理过的窗口配置。|
 * |table||state|Object|「直接使用」处理过的表格配置。|
 * |search||state|Object|「直接使用」开启搜索框操作。|
 * |$visible||state|Boolean|是否显示弹出框。|
 * |$loading||state|Boolean|是否执行提交操作，造成加载效果。|
 * |$data||state|Array|当前组件中拥有的表格数据。|
 * |$keySet||state|Any|选中数据的组件集合。|
 * |$filters||state|Object|搜索产生的搜索条件信息。|
 * |$tableKey||state|String|专用的表格绑定的key信息。|
 * |$ready||state|Boolean|标识当前组件已经加载完成。|
 * |onClick||state|Function|点击函数构造。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. Ajax解析
 *
 * 该解析可参考`xtLazyAjax`的详细说明。
 *
 * #### 3.2. 双选择配置
 *
 * 「只支持单选」选择配置位于`config.selection`，如果`selection.multiple`为true，则选择的时候直接执行
 * 多选操作，而不使用单选，表格之前的类型是`checkbox`，而单选则使用`radio`，这个组件通常不使用该配置。
 *
 * @memberOf module:web-input
 * @method ListSelector
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
        const {$data = {}, $tableKey} = this.state;
        const {onClick, dialog, table = {}, search} = this.state ? this.state : {};
        jsx.onClick = onClick;
        /*
         * 分页计算
         */
        const pageAndChange = Op.yoPager(this, config);
        /*
         * 属性拉平处理
         * 表格处理
         */
        const inputAttrs = Op.yoValue(this, jsx);
        const ref = Ux.onReference(this, 1);

        let $table = Ux.clone(table);
        $table = Op.yoSelected(this, $table);

        Ux.configScroll($table, $data.list, ref);
        /*
         * 处理输入框属性
         */
        const inputCombine = Op.yoCombine(this, inputAttrs);
        return (
            <Input.Group className={jsx.className ? jsx.className : ""}>
                <Input {...inputCombine}/>
                <Dialog className="web-dialog"
                        size={"small"}
                        $visible={this.state['$visible']}   // 窗口是否开启
                        $dialog={dialog}>
                    {search ? (
                        <Row style={{
                            marginBottom: 8
                        }}>
                            <Col span={10}>
                                <Input.Search {...search}/>
                            </Col>
                        </Row>
                    ) : false}
                    <Row>
                        <Col span={24}>
                            <Table key={$tableKey ? $tableKey : Ux.randomString(16)}
                                   loading={this.state['$loading']}
                                   {...config.table} // 原始配置信息
                                   {...$table} // 处理过的表格信息
                                   {...pageAndChange} // 处理分页处理
                                   bordered={false}
                                   className={"web-table"}
                                   dataSource={$data.list}/>
                        </Col>
                    </Row>
                </Dialog>
            </Input.Group>
        );
    }
}

export default Component;
