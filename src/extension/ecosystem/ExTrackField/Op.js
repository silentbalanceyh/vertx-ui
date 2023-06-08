import Ux from 'ux';
import {Dsl} from 'entity';

const rxSelect = (reference) => (event) => {
    const value = Ux.ambEvent(event);
    if (value) {
        /*
         * 选择了合适的字段信息
         */
        const {$identifier, $inited = {}} = reference.props;
        const params = {};
        params.identifier = $identifier;
        params.key = $inited.key;
        params.field = value;

        // reference.?etState({$loading: true});
        Ux.of(reference).loading(false).handle(() => {
            Ux.ajaxGet("/api/history/:identifier/:key/:field", params).then(original => {
                // 按时间排序
                const items = Ux.clone(original);
                items.sort(Ux.sorterDescDFn('createdAt'));
                // 数据信息
                const {$table = {}} = reference.state;
                Ux.ajaxEager(reference, $table.columns, items).then($lazy => {
                    Ux.of(reference).in({
                        $data: {items},
                        $lazy
                    }).load().done();
                    // reference.?etState({$data: {items}, $loading: false, $lazy})
                });
            })
        })
        // Ux.ajaxGet("/api/history/:identifier/:key/:field", params).then(original => {
        //     // 按时间排序
        //     const items = Ux.clone(original);
        //     items.sort(Ux.sorterDescDFn('createdAt'));
        //     // 数据信息
        //     const {$table = {}} = reference.state;
        //     Ux.ajaxEager(reference, $table.columns, items)
        //         .then($lazy => reference.?etState({$data: {items}, $loading: false, $lazy}));
        // })
    } else {
        /*
         * 直接清空
         */
        Ux.of(reference).in({
            $data: {items: []}
        }).done();
        // reference.?etState({$data: {items: []}});
    }
}
const yoFieldAdjust = (reference) => {
    const {data = {}} = reference.props;
    const changes = Ux.isArray(data.items) ? data.items : [];
    return Dsl.codex(reference).bind().done(changes);
}
export default {
    rxSelect,
    // Field
    yoFieldAdjust
}