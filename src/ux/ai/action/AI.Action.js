import React from 'react';
import U from 'underscore';
import {Button} from 'antd';
// Package导入
import Fn from '../../fun';
import Jsx from '../../jsx';
import Prop from '../../prop';
// 文件导入
import E from '../../Ux.Error';
import Value from '../../Ux.Value';
import Type from '../../Ux.Type';
// 内部导入
import Layout from '../layout/AI.Layout';
import Smart from './AI.Action.Smart';
// 内部导入
import Ex from './AI.Ex.Action';

const ai2Submit = (Op = {}) => (reference, jsx = {}) => {
    if (!jsx.op) return false;
    return (jsx.op.map(each => (
        <Button key={each} id={each}
                onClick={E.fxSubmit(reference, Op, each)}/>
    )));
};

const aiFormButton = (reference, onClick, id = false, submit = []) => {
    if (onClick) {
        const {$inited = {}} = reference.props;
        const key = (id) ? ($inited.key ? $inited.key : "") : "";
        const buttons = [];
        const $submit = Value.immutable(submit);
        Type.itObject(onClick, (field, fn) => {
            // 过滤掉非$开头的方法，实现完全绑定规则
            if (field && field.startsWith("$")) {
                const item = {};
                const clientId = `${field}${key}`;
                item.key = clientId;
                item.id = clientId;
                if ($submit.contains(field)) {
                    // 动态绑定raft处理时专用
                    item.onClick = (event) => {
                        event.preventDefault();
                        const executor = fn(reference);
                        return Jsx.rtSubmit(reference, executor);
                    };
                } else {
                    item.onClick = fn(reference);
                }
                buttons.push(item);
            }
        });
        return (
            <span>
                {buttons.filter(item => item.key.startsWith("$")).map(item => (
                    <Button {...item}/>))}
            </span>
        );
    } else {
        console.error("未传入'onClick'事件绑定原始数据！");
    }
};
const aiOp = (reference) => (Op) => Object.keys(Op)
    .filter(key => U.isFunction(Op[key])).map(key => (
        <Button className={"ux-hidden"} key={key} id={key}
                onClick={Op[key](reference)}/>
    ));
const ai2RaftButton = (Op, {id, event = []}) => (cell, reference) => {
    const $event = Value.immutable(event);
    const submit = Object.keys(Op).filter(key => !$event.contains(key));
    const ref = Value.fix(cell, reference);
    return aiFormButton(ref, Op, id, submit);
};
const ai2FormButton = (Op, id = false) => ({
    $button: (cell, reference) => {
        const ref = Value.fix(cell, reference);
        return aiFormButton(ref, Op, id);
    }
});
const ai2FilterButton = (window = 1) => {
    return {
        $button: (cell, reference) => {
            const ref = Value.fix(cell, reference);
            const button = Prop.fromHoc(ref, "button");
            return (1 / 3 === window) ? Layout.aiColumns([5, 19],
                undefined,
                <Button.Group className={"ux-group"}>
                    <Button type={"primary"} icon={"search"}
                            onClick={() => Fn.irFilter(ref)}>{button.search}</Button>
                    <Button icon={"reload"}
                            onClick={Fn.irClear(ref)}>{button.clear}</Button>
                </Button.Group>
            ) : false;
        }
    };
};
export default {
    // 登录按钮替换RxOp使用
    ai2Submit,
    // Event封装按钮专用
    ...Smart,

    // ComplexList专用
    aiFormButton,
    ai2FormButton,
    ai2FilterButton,
    // 特殊模式动态渲染
    ai2RaftButton,
    // Page中直接按钮生成
    aiOp,
    // ExComplexList专用
    Ex,
};