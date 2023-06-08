import Ux from "ux";
import __Zn from '../zero.aero.dependency';

const dataConds = (reference) => {
    const {config = {}, $qrVLock = []} = reference.props;
    const cond = config[__Zn.Opt.SEARCH_COND];
    /*
     * 构造新的查询条件
     */
    const fields = [];
    cond.forEach(field => {
        let expr = field;
        if (0 <= field.indexOf(",")) {
            expr = field.split(",")[0];
        }
        if (!$qrVLock.includes(expr)) {
            fields.push(expr);
        }
    });
    return fields;
}
const Event = {
    dataConds,
    onShow: (reference) => (event) => {
        Ux.prevent(event);
        const {$qr} = reference.props;
        Ux.of(reference).in({
            $visibleQ: true,
            $qrView: $qr,
        }).done()
    },
    onSearch: (reference) => (searchText) => {
        const {config = {}} = reference.props;
        const cond = config[__Zn.Opt.SEARCH_COND];
        if (Ux.isArray(cond)) {

            const fields = dataConds(reference);
            let $condition = {};
            fields.forEach(field => {
                if (searchText) {
                    $condition[field] = [searchText];
                }
            });
            // #QR-COMMENT
            // Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VQDB
            Ux.of(reference)._.qrQ($condition, !searchText).then(() => {
                const ref = Ux.onReference(reference, 1);
                Ux.dglQrSearch(ref);
            });
        } else {
            console.error(`核心配置丢失：${__Zn.Opt.SEARCH_COND}`);
        }
    },
    onChange: (reference) => (event) => {
        Ux.prevent(event);
        const searchText = event.target.value;
        Ux.of(reference).in({searchText}).done();
        // reference.?etState({searchText});
    },
    onClear: (reference) => (event) => {
        Ux.prevent(event);
        const {config = {}} = reference.props;
        const content = config[__Zn.Opt.SEARCH_CONFIRM_CLEAR];
        const md = Ux.v4Modal()
        md.confirm({
            content,
            onOk: () => {
                Ux.of(reference).in({
                    searchText: ""
                }).handle(() => {
                    // $terms
                    const {$terms = {}} = reference.props;
                    Ux.activeColumn($terms);
                    // #QR-COMMENT
                    Ux.of(reference)._.qrQ({}, true);
                })
            }
        })
    }
}

const isSearch = (reference) => {
    const {config = {}} = reference.props;
    const {$search} = reference.state;
    return !!config[__Zn.Opt.SEARCH_ENABLED] && !!$search;
};
const isAdvanced = (reference) => {
    const {config = {}} = reference.props;
    const {$advanced} = reference.state;
    return !!config[__Zn.Opt.SEARCH_ADVANCED] && !!$advanced;
};
export default {
    isSearch,
    isAdvanced,
    // 穿透
    ...Event,
}