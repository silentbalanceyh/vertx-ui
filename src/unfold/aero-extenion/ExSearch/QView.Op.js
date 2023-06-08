import Ux from "ux";
import __Zn from "../zero.aero.dependency";

const __qrCalc = (reference, $qrView = {}) => {
    const {$qr = {}} = reference.props;
    const updatedQr = {};
    Object.keys($qr).forEach(qrItem => {
        if ("connector" === qrItem) {
            updatedQr[""] = $qrView[""];
        } else {
            if ($qrView.hasOwnProperty(qrItem)) {
                updatedQr[qrItem] = $qrView[qrItem];
            } else {
                updatedQr[qrItem] = Ux.Env.CV_DELETE;
            }
        }
    });
    Object.keys($qrView).filter(item => !$qr.hasOwnProperty(item))
        .forEach(item => updatedQr[item] = $qrView[item]);
    return updatedQr;
}
export default {
    onViewPre: (reference) => (updated = {}) => {
        const $qrView = Ux.clone(updated);
        Ux.of(reference).in({$qrView}).done();
        // reference.?etState({$filters});
    },
    opViewSave: (reference) => (event) => {
        Ux.prevent(event);
        const {config = {}} = reference.props;
        const fnExecutor = () => {
            const {rxMyViewQ} = reference.props;
            if (!Ux.isFunction(rxMyViewQ)) {
                throw new Error("[ Ex ] 核心函数丢失：rxMyViewQ ");
            }
            const {$qrView = {}} = reference.state;

            // Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VQX3
            const $qrRequest = {};
            Object.keys($qrView)
                .filter(field => Ux.Env.CV_DELETE !== $qrView[field])
                .forEach(field => $qrRequest[field] = $qrView[field]);


            const $qrUp = Ux.irSwitcher(reference)
                // connector -> "";
                .server($qrRequest, false);
            Ux.of(reference).submitting().handle(() => {
                rxMyViewQ($qrUp).then(() => {
                    // 关闭当前窗口
                    const updatedQr = __qrCalc(reference, $qrUp);
                    Ux.of(reference)._.qrFilter(updatedQr, {
                        $spinning: true, $loading: true,
                    }).then(() => {

                        Ux.of(reference).submitted().in({$visibleQ: false}).done();
                    })
                    // 更新上层状态
                    // reference.?etState({$visibleQ: false});
                });
            })
        }
        const view = config[__Zn.Opt.SEARCH_CRITERIA_VIEW];
        if (view.confirm) {
            const md = Ux.v4Modal()
            md.confirm({
                width: 560,     // 标准文字长度
                content: view.confirm,
                onOk: fnExecutor
            })
        } else {
            fnExecutor()
        }
    },
}