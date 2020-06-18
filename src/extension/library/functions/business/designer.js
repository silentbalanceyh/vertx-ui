import Ux from 'ux';
import Ajx from '../../ajax';
import G from '../global';

const tabular = (reference, define = false) => {
    /* 定义信息 */
    if (define) {
        const define = {};
        define.name = "tabular";
        define.uri = "/api/types/tabulars";
        define.method = "POST";
        define.magic = {
            $body: []
        }
        define.group = "type";
        return Ux.promise(define);
    } else {
        // 注意两个地方返回的都是 tabular，这里是元数据
        return Ajx.tabular({type: G.V.TYPE_TABULAR});
    }
}
const category = (reference, define = false) => {
    if (define) {
        const define = {};
        define.name = "category";
        define.uri = "/api/types/categories";
        define.method = "POST";
        define.magic = {
            $body: []
        }
        define.group = "type";
        return Ux.promise(define);
    } else {
        // 注意两个地方返回的都是 tabular，这里是元数据
        return Ajx.tabular({type: G.V.TYPE_CATEGORY});
    }
}
/*
 * 二义性函数
 */
const type = (reference) => (params, define = false) => {
    const {type} = params;
    if ("TABULAR" === type) {
        return tabular(reference, define);
    } else if ("CATEGORY" === type) {
        return category(reference, define);
    } else {
        console.error("检查参数对应信息：", params);
        throw new Error("请检查参数信息！")
    }
}
const api = (reference) => (keyword) => {
    if (keyword) {
        return Ux.ajaxPost('/api/action/seek', {keyword});
    } else return Ux.promise([]);
}
const submit = (reference) => (params, fnCallback) => {
    // console.info(params, reference.props);
    const {$inited = {}} = reference.props;    // 原始表单
    const request = Ux.clone($inited);
    if (request.key) {
        // 构造请求中的核心数据
        {
            // 基础属性
            request.window = params.window;
            request.columns = params.columns;
            if (Ux.isArray(params.hidden)) {
                request.hidden = params.hidden;
            }
            const metadata = {};
            if (!request.metadata) {
                // 如果没有任何 metadata 则初始化一份
                Object.assign(metadata, {
                    deletion: true,     // 可删除
                    edition: true,      // 可编辑
                    design: true        // 可设计
                });
            } else {
                Object.assign(metadata, request.metadata);
            }
            // 在 metadata 中挂载 initial 节点
            if (params.initial && !Ux.isEmpty(params.initial)) {
                metadata.initial = params.initial;
            }
            // 在 metadata 中挂载 assist 节点
            if (params.assist && !Ux.isEmpty(params.assist)) {
                metadata.assist = params.assist;
            }
            // 创建类，没有 key 值
            request.metadata = metadata;
        }
        {
            // 构造 op 相关信息
            if (params.actions) {
                // ops 的数组构造（当前表单所有提交类的OP信息）
                const ops = [];
                Object.keys(params.actions).forEach(opKey => {
                    ops.push(Ux.clone(params.actions[opKey]));
                });
                request.ops = ops;
            }
            // 构造 fields 相关信息
            const fields = [];
            params.ui.forEach((row, rowIndex) => row.forEach((cell, cellIndex) => {
                const field = {key: Ux.randomUUID()};
                /*
                 *  key:            自动生成
                 *  xPoint:         列坐标
                 *  yPoint:         行坐标
                 *  label:          optionItem.label
                 *  name:           field
                 *  span:           span
                 *  hidden:         hidden（是否隐藏）
                 *  render:         render 的值
                 *  optionJsx：     直接读取
                 *  optionConfig:   除开 rules 之后的值
                 *  optionItem:     除开 label 之后的值（包括除去布局字段）
                 *  rules:          验证规则，从 optionConfig 中提取
                 *  controlId:      后端计算
                 *  rowType:        FIELD / TITLE
                 *  active:         默认 true
                 *  sigma:          直接从表单中读
                 *  language:       直接从表单中读
                 */
                field.xPoint = cellIndex;
                field.yPoint = rowIndex;

                field.active = true;
                field.sigma = request.sigma;
                field.language = request.language;

                field.span = cell.span; // 该值必须有

                // 基础配置
                if (cell.optionJsx) {
                    field.optionJsx = Ux.clone(cell.optionJsx);
                }

                // optionItem 拆
                if (cell.hasOwnProperty("title")) {
                    // 标题处理
                    field.rowType = "TITLE";
                    field.hidden = false;
                    field.label = cell.title;
                } else {
                    // 字段处理
                    field.rowType = "FIELD";
                    field.render = cell.render; // 该值在这里必须存在
                    field.name = cell.field;    // 该值在这里必须存在
                    if (cell.hidden) {
                        field.hidden = cell.hidden;
                    } else {
                        field.hidden = false;
                    }
                    field.field = cell.field;
                    // optionItem
                    const $optionItem = Ux.clone(cell.optionItem);
                    const {label, ...rest} = $optionItem;
                    field.label = label;

                    if (rest.style) delete rest.style;
                    if (rest.labelCol) delete rest.labelCol;
                    if (rest.wrapperCol) delete rest.wrapperCol;

                    field.optionItem = rest;

                    // optionConfig
                    if (cell.optionConfig) {
                        const $optionConfig = Ux.clone(cell.optionConfig);
                        const {rules = [], ...restConfig} = $optionConfig;
                        field.rules = rules;
                        field.optionConfig = restConfig;
                    } else {
                        field.rules = null;
                        field.optionConfig = null;
                    }
                }
                fields.push(field);
            }));
            request.fields = fields;
        }
        return Ux.ajaxPut("/api/ui-form/cascade/:key", request).then(response => {
            // 弹出窗口
            Ux.sexDialog(reference, "designed", () => {
                // 内置关闭
                fnCallback();
                // rxClose 调用
                Ux.fn(reference).rxClose();
            })
        });
    } else {
        console.error("异常，没有表单的原始信息！", request.key);
    }
}
export default (reference) => ({
    rxType: type(reference),
    rxApi: api(reference),
    rxSubmit: submit(reference)
})