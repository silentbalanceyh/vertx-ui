import Log from '../../develop/logger';
import U from 'underscore';
import Field from '../web-field';
import Abs from '../../abyss';
import Action from '../action';
import Value from "../../element";

const raftValue = (cell = {}, values = {}) => {
    // 默认active处理
    if (values.hasOwnProperty(cell.field)) {
        let literal = values[cell.field];
        if (cell.moment) {
            if (U.isArray(literal)) {
                const newArray = [];
                literal.forEach(item => newArray.push(Value.valueTime(item)));
                literal = newArray;
            } else {
                literal = Value.valueTime(literal);
            }
        }
        cell.optionConfig.initialValue = literal;
    }
};
/*
 * 最复杂的一个方法，用于设置 render 的最终状态
 */
const raftRender = (raft = {}, config = {}) => {
    const {
        cell = {},
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
     * 2）其次以配置驱动的 props 中的 $jsx 优先（Zero Extension在使用）
     */
    const renders = {};
    if (addOn.renders) {
        Object.assign(renders, addOn.renders);
    } else {
        const {$jsx} = reference.props;
        if ($jsx) {
            Object.assign(renders, $jsx);
        }
    }
    /*
     * 准备三个参数来执行最终的函数生成
     * reference
     * renders
     * cell
     * 1）先从 renders 中查找，看是否可以找到
     * 2）然后搜索标准表单库查找
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
    if (!U.isFunction(fnRender)) {
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
    // Ant-Design 表单化处理
    const {form} = reference.props;
    const {getFieldDecorator} = form;
    /*
     * 是 Action 就不需要 getFieldDecorator 修饰
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
             * 拷贝动作必须在这里做
             */
            raftValue(cell, values);
            const optionJsx = Abs.clone(cell.optionJsx);
            const optionConfig = Abs.clone(cell.optionConfig);

            return getFieldDecorator(cell.field, optionConfig)(
                render(reference, optionJsx)
            );
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
            const {getFieldDecorator} = form;
            hidden.render = (values = {}) => {
                const initialValue = values[field];
                return getFieldDecorator(field, {
                    initialValue
                })(Field.aiHidden(reference, {name: field, key: field}))
            };
            raft.hidden.push(hidden);
        })
    }
};

export default {
    raftRender,
    raftHidden,
    raftValue,
}