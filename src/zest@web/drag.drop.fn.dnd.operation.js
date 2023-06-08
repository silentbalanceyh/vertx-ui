import __Zn from './zero.module.dependency';
import {useDrag, useDrop} from 'react-dnd';
import React from 'react';

const dndDropColor = (reference, isOver, additional) => {
    if (reference) {
        const state = reference.state ? reference.state : {};
        const isCall = __Zn.isFunction(reference.props['rxDropOver']);
        if (isOver) {
            /*
             * 悬停在上方的时候执行该操作
             * 1. 第一次不悬停时执行
             */
            const {$hover} = state;
            if (!$hover) {
                const updateState = {$hover: true};
                if (additional) Object.assign(updateState, additional);
                __Zn.of(reference).in(updateState).handle(() => {

                    if (isCall) __Zn.fn(reference)['rxDropOver']($hover, additional);
                })
                // reference.?etState(updateState);
                // if (isCall) __Zn.fn(reference)['rxDropOver']($hover, additional);
            }
        } else {
            /*
             * 离开了 Drop 组件
             */
            const {$hover} = state;
            if ($hover) {
                const updateState = {$hover: false};
                if (additional) Object.assign(updateState, additional);
                __Zn.of(reference).in(updateState).handle(() => {

                    if (isCall) __Zn.fn(reference)['rxDropOver']($hover, additional);
                })
                // reference.?etState(updateState);
                // if (isCall) __Zn.fn(reference)['rxDropOver']($hover, additional);
            }
        }
    } else {
        console.error("传入引用非法，请检查代码！", reference)
    }
}
const __buildFn = (options = {}, props) => {
    const $options = {};
    Object.keys(options).forEach(field => {
        if (field.endsWith("Fn")) {
            const item = options[field](props);
            if (__Zn.isFunction(item)) {
                $options[field.substring(0, field.length - 2)] = item;
            }
        } else {
            $options[field] = options[field];
        }
    })
    return $options;
}
// hooks in class
const dndDragHoc = (options = {}) => (Component) => {
    return (props) => {
        const [collected, drag, dragPreview] = useDrag(() => ({
            ...__buildFn(options, props),
            item: {
                ...options.item,
                data: props.data,
            }
        }));
        const $dnd = {};
        $dnd.collected = collected;
        $dnd.drag = drag;
        $dnd.dragPreview = dragPreview;
        return (
            <Component {...props} $dnd={$dnd}/>
        )
    }
}
const dndDropHoc = (options = {}) => (Component) => {
    return (props) => {
        const [collectedProps, drop] = useDrop(() => ({
            ...__buildFn(options, props)
        }));
        const $dnd = {};
        $dnd.collectedProps = collectedProps;
        $dnd.drop = drop;
        return (
            <Component {...props} $dnd={$dnd}/>
        )
    }
}
const dndDragWrap = (reference, renderFn) => {
    const {$dnd} = reference.props;
    if ($dnd) {
        const {collected, drag, dragPreview} = $dnd;
        return collected.isDragging ? (
            <div ref={dragPreview}/>
        ) : (
            <div ref={drag} {...collected}>
                {renderFn($dnd)}
            </div>
        )
    } else {
        return renderFn($dnd);
    }
}
const dndDropWrap = (reference, renderFn) => {
    const {$dnd} = reference.props;
    if ($dnd) {
        const {drop} = $dnd;
        return (
            <div ref={drop}>
                {renderFn($dnd)}
            </div>
        )
    } else {
        return renderFn($dnd);
    }
}
export default {
    dndDropColor,
    dndDropHoc,
    dndDropWrap,

    dndDragHoc,
    dndDragWrap,
}