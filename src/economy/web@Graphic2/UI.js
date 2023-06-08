import React from 'react'
import Ux from 'ux';


/**
 * ## 「组件」`Graphic2`
 *
 * ```js
 * import { Graphic2 } from 'web';
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
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |config||props|Object|g2图形专用配置数据。|
 * |data||props|Array|渲染图形专用的数据。|
 * |$gid||props|String|当前g2图形的`<div/>`的id属性，g2的API专用。|
 * |$gFn||props|Function|构造配置的专用函数。|
 * |$g2||state|Object|最终计算出来的配置信息。|
 * |$ready||state|Boolean|标识当前组件已经加载完成。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. `$gFn`函数
 *
 * `$gFn`是一个必须传入的函数，用于构造graphic引用，这个引用可直接调用下边API执行图形渲染，
 * 目前可绑定的函数如：
 *
 * * `Ux.g2Bar`：饼图构造函数。
 *
 *
 * @memberOf module:uca/economy
 * @method Graphic2
 **/
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (ref) => {
    const {config = {}, $gid = "", $gFn} = ref.props;
    const state = {};
    if (Ux.isFunction($gFn)) {
        const $g2 = $gFn($gid, config);
        state.$g2 = $g2;
        // 添加方法
        const {data = []} = ref.props;
        if ($g2) {
            $g2.data(data);
            $g2.render();
        }
    }
    //state.$ready = true;
    //ref.?etState(state);
    Ux.of(ref).in(state).ready().done();
}
const componentUp = (ref, prevProps) => {
    // 数据变更
    const {$ready = false} = ref.state;
    if ($ready) {
        const current = this.props.data;
        const previous = prevProps.data;
        if (Ux.isDiff(current, previous)) {
            // 重绘
            const {$g2} = this.state;
            if ($g2) {
                $g2.changeData(current);
                $g2.render();
            }
        }
    }
}

class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, prevProps);
    }

    render() {
        const {$gid = ""} = this.props;
        return $gid ? (
            <div id={$gid}/>
        ) : (
            <div>$gid is Null</div>
        )
    }
}

export default Component