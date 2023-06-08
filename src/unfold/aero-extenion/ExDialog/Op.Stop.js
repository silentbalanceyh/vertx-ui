import Ux from 'ux';

const isStop = (addOn = {}) => {
    const {
        $stop = false
    } = addOn;
    return $stop;
}
/*
 * ExDialog 有特殊配置用于执行穿透效果，默认场景下是会直接执行穿透的
 *
 * ExListComplex -> ExAction -> ExDialog -> ExXXX
 *
 * 1）最上层 ExListComplex 提供了
 *    -- rxSubmitting
 *    -- rxClose
 * 2）ExAction不管这一层
 * 3）ExDialog 中执行 $stop 中断
 * 4）调用时选择是否中断，不中断则直接调用顶层 rsSubmitting，中断则只调用
 *    ExDialog 中的逻辑，最终实现整体状态一致性原则
 *
 * 特殊点：
 * 1）ExEditorColumn 中存在特殊函数：rxPop
 *    -- 开启 $stop 中断
 *    -- 调用 rxPop 将顶层组件屏蔽，由于它是 Popover 类型，无法像弹窗一样直接屏蔽顶层
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    rxClose: (reference) => (response, addOn = {}) => {
        const data = Ux.ambEvent(response);
        // 内层窗口管理
        return Ux.of(reference).in(data).hide().next().then(() => {
            // 对于是否执行外层 rxClose 函数的设置
            if (isStop(addOn)) {
                return Promise.resolve(null);
            }
            return Ux.of(reference)._.close(data, addOn);
        })
    },
    rxSubmitting: (reference) => ($submitting, addOn = {}) => {
        let of = Ux.of(reference);
        // Setting
        of = $submitting ? of.submitting() : of.submitted();

        return of.next().then(() => {
            if (isStop(addOn)) {
                return Promise.resolve(null);
            }
            if ($submitting) {
                return Ux.of(reference)._.submitting();
            } else {
                return Ux.of(reference)._.submitted();
            }
        })
    }
}