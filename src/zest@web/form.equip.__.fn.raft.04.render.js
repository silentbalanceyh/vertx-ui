import __Zn from './zero.module.dependency';
import __ACTION from './form.equip.__.fn.raft.action';
import {_Logger} from "zo";
import {Form} from "antd";

const Cv = __Zn.Env;
/*
 * optionConfig,
 * optionJsx,
 * optionItem
 */
const __raftCell = (cell = {}, cellHigh = {}) => {
    const result = __Zn.clone(cell);
    const {
        optionJsx = {},
        optionItem = {},
        optionConfig = {},
        ...optionRest
    } = cellHigh;
    result.optionConfig = Object.assign(cell.optionConfig ? cell.optionConfig : {}, optionConfig);
    result.optionJsx = Object.assign(cell.optionJsx ? cell.optionJsx : {}, optionJsx);
    result.optionItem = Object.assign(cell.optionItem ? cell.optionItem : {}, optionItem);
    Object.assign(result, optionRest);
    return result;
}
const raftRender = (cell = {}, config = {}, UcaField = {}) => {
    const {
        calculated = {},
        addOn = {},
    } = config;
    const {
        entity
    } = calculated;
    const {reference} = addOn;     // 抽取引用信息
    /*
     * 外置 renders 计算
     * 1）addOn 中为编程使用的 renders，优先考虑
     * 2）其次以配置驱动的 props 中的 $renders 优先（Zero Extension在使用）
     * 3）在 DialogEditor 中会有其他内容可处理
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
    if (!__Zn.isFunction(fnRender)) {
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
    _Logger.render(2, cell, fnRender);
    let isAction = false;       // 表示按钮工具
    if (!__Zn.isFunction(fnRender) && cell.field) {
        /*
         * 第一次查找未找到：执行过查找和自查找
         */
        if (cell.field.startsWith("$")) {
            /*
             * 第一类：$button
             */
            if (Cv.K_NAME.BUTTON === cell.field) {
                /*
                 * 处理属性
                 */
                cell.optionJsx.actions = __ACTION.raftAction(cell, reference);
                // 连接 aiAction 执行
                const aiKey = cell.render ? cell.render : "aiAction";
                fnRender = UcaField[aiKey];
                isAction = true;
            }
        } else {
            /*
             * 针对 holder要单独处理，所以这里只处理不包含 holder
             */
            if (!cell.hasOwnProperty('holder')) {
                const aiKey = cell.render ? cell.render : "aiInput";
                fnRender = UcaField[aiKey];
            }
        }
    }
    /*
     * 打印错误信息专用
     */
    if (!fnRender && !cell.title) {
        throw Error(`Render未找到，field = ${cell.field}, type = ${cell.render}`);
    }
    const renderJsx = fnRender;
    // 最终呈现形态 renderJsx
    const cellConfig = __Zn.clone(cell);
    if (isAction) {
        // 操作类
        return (values = {}, cellRender = {}, reference) => {
            // 此处顺序相反，必须使用 cellConfig 覆盖 cellRender 中的 optionJsx，再执行计算
            const cell = __raftCell(cellRender, cellConfig); // {...cellRender, ...cellConfig}
            /*
             * 第一种防重复提交
             */
            const configuration = {
                cell, reference, renders
            };
            /*
             * 处理
             */
            const optionJsx = __Zn.v4InputDepend(values, {
                reference, cell,
            });

            const configurationJsx = {
                ...configuration,
                cell: {
                    ...cell,
                    optionJsx       // 用计算之后的 optionJsx
                }
            };
            // item
            const item = __Zn.v4InputItem(values, configurationJsx);
            const {$submitting = false} = reference.state;
            if ($submitting) optionJsx.loading = $submitting;      // 为 true 时
            return (
                <Form.Item {...item}>
                    {renderJsx(reference, optionJsx)}
                </Form.Item>
            )
        };
    } else {
        // 非操作类
        return (values, cellRender = {}, reference) => {
            const cell = __raftCell(cellConfig, cellRender); // {...cellConfig, ...cellRender}
            const configuration = {
                cell, reference, renders
            };
            // optionsJsx
            const optionJsx = __Zn.v4InputJsx(values, configuration);

            const configurationJsx = {
                ...configuration,
                cell: {
                    ...cell,
                    optionJsx       // 用计算之后的 optionJsx
                }
            };
            // item
            const item = __Zn.v4InputItem(values, configurationJsx);
            return (
                <Form.Item {...item}>
                    {(() => {
                        const form = __Zn.v4FormRef(reference);     // reference.props;
                        if (form) {
                            return renderJsx(reference, optionJsx);
                        } else {
                            const {props = {}} = reference;
                            if (props.hasOwnProperty(Cv.K_NAME.$DATA_FIELD)) {
                                /* （2阶）自定义组件 */
                                return __Zn.v4InputEvent(values, configurationJsx)
                            } else {
                                /* 纯组件 */
                                return renderJsx(reference, optionJsx, optionJsx.onChange);
                            }
                        }
                    })()}
                </Form.Item>
            )
        }
    }
};
export default {
    raftRender,
}