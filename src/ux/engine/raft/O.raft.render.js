import Log from '../../develop/logger';
import U from 'underscore';
import Field from '../web-field';
import Abs from '../../abyss';
import Action from '../action';
import Value from "../../element";
import parser from '../parser';
import Ut from '../../unity';
import Unit from '../web-unit';
import Cv from '../../constant';

const raftValue = (cell = {}, values = {}, reference) => {
    // 默认active处理
    let literal;
    if (values.hasOwnProperty(cell.field)) {
        literal = values[cell.field];
    } else {
        /*
         * 必须包含了 field
         */
        if (cell.field && 0 < cell.field.indexOf('.')) {
            const path = cell.field.split('.');
            literal = Abs.immutable(values).getIn(path);
        }
    }
    /*
     * 防止 false 无法给值
     */
    if (literal) {
        /*
         * 计算初始值
         * 1）如果 literal 是 Object 且包含了 $delay，执行二次表达
         * 2）如果 literal 就是 Object 且不包含 $delay，直接用 literal
         * 3）非 Object 的时候，是否处理时间格式，cell.moment 有定义
         */
        if (U.isObject(literal)) {
            if (literal) {
                const {$delay = false, expression = ""} = literal;
                if ($delay) {
                    /*
                     * 解析
                     */
                    literal = parser.parseValue(expression, reference);
                }
            }
        } else {
            if (cell.moment) {
                if (U.isArray(literal)) {
                    const newArray = [];
                    literal.forEach(item => newArray.push(Value.valueTime(item)));
                    literal = newArray;
                } else {
                    /*
                     * ACL 控制，维持原值，保证更新
                     */
                    if (Cv.FORBIDDEN === literal) {
                        literal = Value.valueTime("9999-01-01");
                    } else {

                        literal = Value.valueTime(literal);
                    }
                }
            }
        }
        cell.optionConfig.initialValue = literal;
    } else {
        /*
         * 布尔值初始化
         */
        cell.optionConfig.initialValue = literal;
    }
};
/*
 * 最复杂的一个方法，用于设置 render 的最终状态
 */
const raftRender = (cell = {}, config = {}) => {
    const {
        calculated = {},
        addOn = {}
    } = config;
    const {
        entity
    } = calculated;
    const {reference} = addOn;     // 抽取引用信息
    /*
     * 外置 renders 计算
     * 1）addOn 中为编程使用的 renders，优先考虑
     * 2）其次以配置驱动的 props 中的 $renders 优先（Zero Extension在使用）
     */
    const renders = {};
    if (addOn.renders) {
        Object.assign(renders, addOn.renders);
    } else {
        const {$renders} = reference.props;
        if ($renders) {
            Object.assign(renders, $renders);
        }
    }
    /*
     * 准备三个参数来执行最终的函数生成
     * reference
     * renders
     * cell
     * 1）这里的 renders 来源两个方向
     * -- 编程的时候传入的第三参数 program
     * -- $renders 变量，直接从属性之外传入
     * *：它拥有最高优先级
     */
    let fnRender = renders[cell.field];
    if (!U.isFunction(fnRender)) {
        /*
         * 执行子查找
         */
        if (entity && cell.field.startsWith('children')) {
            const hitKey = cell.field.split(`.${entity}.`)[1];
            if (hitKey && "string" === typeof hitKey) {
                fnRender = renders[hitKey];
            }
        }
    }
    Log.render(2, cell, fnRender);
    let isAction = false;       // 表示按钮工具
    if (!U.isFunction(fnRender) && cell.field) {
        /*
         * 第一次查找未找到：执行过查找和自查找
         */
        if (cell.field.startsWith("$")) {
            /*
             * 第一类：$button
             */
            if ("$button" === cell.field) {
                /*
                 * 处理属性
                 */
                Action.raftAction(cell, reference);
                // 连接 aiAction 执行
                const aiKey = cell.render ? cell.render : "aiAction";
                fnRender = Field[aiKey];
                isAction = true;
            }
        } else {
            /*
             * 针对 holder要单独处理，所以这里只处理不包含 holder
             */
            if (!cell.hasOwnProperty('holder')) {
                const aiKey = cell.render ? cell.render : "aiInput";
                fnRender = Field[aiKey];
            }
        }
    }
    /*
     * 打印错误信息专用
     */
    const render = fnRender ? fnRender : () => {
        console.error(`Render未找到，field = ${cell.field}, type = ${cell.render}`);
    };
    /*
     * 是 Action 就不需要 Ant Form 中的修饰
     */
    // Object.freeze(cell.optionJsx);
    // Object.freeze(cell.optionConfig);
    if (isAction) {
        return () => {
            const optionJsx = Abs.clone(cell.optionJsx);
            /*
             * 第一种防重复提交
             */
            const {$loading = false} = reference.state;
            if ($loading) optionJsx.loading = $loading;      // 为 true 时
            /*
             * 处理
             */
            Ut.writeSegment(reference, optionJsx);
            return render(reference, optionJsx);
        };
    } else {
        /*
         *  旧代码
         *  const optionJsx = Abs.clone(cell.optionJsx);
         *  const optionConfig = Abs.clone(cell.optionConfig);
         */
        return (values) => {
            /*
             * 执行初始值，包含 $delay 模式
             */
            raftValue(cell, values, reference);

            /*
             * depend 计算
             * 1）impact
             * 2）enabled
             */
            let optionJsx = Abs.clone(cell.optionJsx);
            if (!optionJsx) optionJsx = {};      // 防止 undefined 出现


            /*
             * 插件专用处理，该插件在 connectValidator 之前触发
             * 否则 disabled / readOnly 部分会出问题
             */
            Ut.writeSegment(reference, optionJsx, cell.field);


            /*
             * 1）rules 和 validateTrigger 计算，特殊连接
             * 2）optionJsx 必须经过计算来执行 rules 的筛选，计算过后才会出现 disabled 属性
             */
            const optionConfig = Ut.connectValidator({
                optionJsx,
                optionConfig: cell.optionConfig,
                render: cell.render,
            });


            /*
             * 解决某些场景无法赋值的忧伤
             */
            optionJsx['data-field'] = cell.field;
            if (optionJsx && values[cell.field]) {
                optionJsx['data-initial'] = values[cell.field];
            }

            /*
             * 子表单 renders 继承
             */
            Ut.connectRenders(optionJsx, cell, renders);
            
            const {form} = reference.props;
            if (form) {

                /*
                 * Ant-Design 表单化处理
                 */
                optionJsx.reference = reference;    // 特殊引用，触发 depend / linker
                const {getFieldDecorator} = form;
                if (cell.field) {
                    /*
                     * 只有这个位置需要代码支撑
                     * 增加一种情况，如果当前字段 disabled 的时候，
                     * 1) Checkbox 的 value 必须 undefined，同样是修改 optionConfig
                     */
                    Ut.writeInitial(optionConfig, optionJsx, cell);
                    /*
                     * 装饰之前执行一次
                     */
                    return getFieldDecorator(cell.field, optionConfig)(
                        render(reference, optionJsx)
                    );
                } else return render(reference, optionJsx);
            } else {
                if (reference.props.hasOwnProperty('data-__field')) {
                    /* 自定义组件专用 */
                    return Unit.aiOn(render).onChange(reference, {
                        ...cell,
                        optionJsx
                    })
                } else {
                    return render(reference, optionJsx, optionJsx.onChange);
                }
            }
        }
    }
};

const raftHidden = (raft = {}, $form, reference) => {
    /*
     * hidden 默认值
     */
    if (U.isArray($form.hidden)) {
        raft.hidden = [];
        $form.hidden.forEach(field => {
            const hidden = {};
            const {form} = reference.props;
            if (form) {
                /*
                 * Hidden 无所谓，不可能会触发相关操作
                 */
                const {getFieldDecorator} = form;
                hidden.render = (values = {}) => {
                    const initialValue = values[field];
                    return getFieldDecorator(field, {
                        initialValue
                    })(Field.aiHidden(reference, {name: field, key: field}))
                };
            } else {
                hidden.render = Field.aiHidden(reference, {name: field, key: field});
            }
            raft.hidden.push(hidden);
        })
    }
};

export default {
    raftRender,
    raftHidden,
    raftValue,
}