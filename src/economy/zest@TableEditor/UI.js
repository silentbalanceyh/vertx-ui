/**
 * ## 「组件」`TableEditor`
 *
 * 列表选择器
 *
 * ```js
 * import { TableEditor } from 'web';
 * ```
 *
 * ### 0. 示例
 *
 * ```json
 * {
 *      "metadata": "items,选项表,24,,aiTableEditor",
 *      "optionJsx.depend.enabled": {
 *          "dataSource": [
 *              "items"
 *          ]
 *      },
 *      "optionJsx.config": {
 *          "format": {
 *              "type": "ARRAY",
 *              "keyField": "name"
 *          },
 *          "table": {
 *              "columns": [
 *                  {
 *                      "dataIndex": "name",
 *                      "title": "固定值",
 *                      "$render": "EDITOR"
 *                  },
 *                  {
 *                      "dataIndex": "label",
 *                      "title": "显示字段",
 *                      "$render": "EDITOR"
 *                  }
 *              ]
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
 * |Ok|Ok|x|
 *
 * ### 2. 属性说明
 *
 * 该属性说明位于`optionJsx.config`节点中，即`jsx`中的`config`对象信息。
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |value||props|Object|Ant Form给当前组件传入的值。|
 * |config|format|props|Object|多格式表格编辑。|
 * |config|table|props|Object|表格专用配置。|
 * |data||state|Any|根据格式计算的最终数据信息。|
 * |$table||state|Object|处理过的表格配置。|
 * |$ready||state|Boolean|标识当前组件已经加载完成。|
 *
 * ### 3. 组件核心点
 *
 * 包含了添加、删除两个操作，新增和删除按钮会在执行过程中被禁用或启用。
 *
 * @memberOf module:uca/zest
 * @method TableEditor
 */
// =====================================================
// componentInit/componentUp
// =====================================================

export {TableEditor} from 'zs';