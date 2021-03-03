import React from 'react';
import Op from './Op';
import Ux from 'ux';
import {Col, Input, Row, Table} from "antd";
import {Dialog} from "web";
import './Cab.less';

/**
 * ## 「组件」`MatrixSelector`
 *
 * 列表选择器
 *
 * ```js
 * import { MatrixSelector } from 'web';
 * ```
 *
 * ### 0.示例
 *
 * ```json
 * {
 *      "metadata": "actions,关联操作,24,,aiMatrixSelector",
 *      "optionConfig.rules": [
 *          {
 *              "validator": "required",
 *              "message": "对不起，关联操作不可为空，请添加关联操作！"
 *          }
 *      ],
 *      "optionJsx.config": {
 *          "ajax": {
 *              "metadata": "POST,/api/action/search,1,10,sorter=updatedAt`DESC",
 *              "params.criteria": {
 *                  "permissionId,n": true
 *              }
 *          },
 *          "table": {
 *              "columns": [
 *                  "name,操作名称",
 *                  "code,操作编码",
 *                  {
 *                      "metadata": "method,HTTP方法,MAPPING",
 *                      "$mapping": {
 *                          "GET": "GET,download,,#268941",
 *                          "PUT": "PUT,edit,,#0a7bed",
 *                          "POST": "POST,plus,,#f6af03",
 *                          "DELETE": "DELETE,delete,,#e22015"
 *                      }
 *                  },
 *                  {
 *                      "dataIndex": "uri",
 *                      "title": "请求路径"
 *                  }
 *              ]
 *          },
 *          "validation": "请选择关联操作！",
 *          "window": "关联操作,选择,关闭,false,980,false",
 *          "search": {
 *              "name,c": "名称",
 *              "code,c": "编码"
 *          },
 *          "selection": {
 *              "multiple": true,
 *              "multipleMode": {
 *                  "replace": false
 *              }
 *          },
 *          "dynamic": {
 *              "dataIndex": "key",
 *              "title": "添加",
 *              "config": {
 *                  "text": "移除",
 *                  "confirm": "该操作会从当前权限中移除选中操作，确认？"
 *              }
 *          }
 *      }
 * }
 * ```
 *
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
 * |config|dynamic|props|Object|动态操作列（添加、删除）。|
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
 * #### 3.1. 多选专用配置
 *
 * 「只支持多选」选择配置位于`config.selection`，如果`selection.multiple`为true，则选择的时候直接执行
 * 多选操作，多选操作中会包含额外的模式信息。
 *
 * ```json
 * {
 *     "multiple": true,
 *     "multipleMode":{
 *         "replace": true
 *     }
 * }
 * ```
 *
 * replace设置的模式
 *
 * * true：替换模式，每次选择的时候直接替换原始内容。
 * * false：追加模式，每次选择的时候直接追加新的（如果有旧的直接合并）。
 *
 * #### 3.2. 动态列操作
 *
 * 动态列操作提供`添加，删除`两个选项，这两个选项负责针对数据执行增删的细节操作，以完善对应的选择信息。
 *
 * @memberOf module:web-input
 * @method MatrixSelector
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
        /*
         * Lazy Init
         */
        Ux.xtLazyInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Ux.xtLazyUp(this, {props: prevProps, state: prevState});
    }

    render() {
        const {config = {}, value = []} = this.props;
        const {$data = {}, $tableKey, $visible = false} = this.state;
        const {dialog, table = {}, search} = this.state ? this.state : {};
        /*
         * 分页计算
         */
        const pageAndChange = Op.yoPager(this, config);
        /*
         * 属性拉平处理
         * 表格处理
         */
        const ref = Ux.onReference(this, 1);

        let $table = Ux.clone(table);
        $table = Op.yoSelected(this, $table);

        Ux.configScroll($table, $data.list, ref);
        /*
         * 处理输入框属性
         */
        const $tableTarget = Op.yoTarget(this, table);
        Ux.configScroll($tableTarget, value, ref);
        return (
            <Input.Group>
                {Ux.aiFloatError(this, !$visible)}
                <Table {...$tableTarget} className={"web-table web-matrixselector-table"}
                       dataSource={value}/>
                <Dialog className="web-dialog"
                        size={"small"}
                        $visible={this.state['$visible']}   // 窗口是否开启
                        $dialog={dialog}>
                    {search ? (
                        <Row style={{
                            marginBottom: 8
                        }}>
                            <Col span={6}>
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