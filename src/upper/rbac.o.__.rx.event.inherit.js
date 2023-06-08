import Ux from "ux";

export default {
    rxChildFn: (reference) => (request, refresh = false) => {
        let {$keyChild = {}} = reference.state;
        $keyChild = Ux.clone($keyChild);
        if (!Ux.isEmpty(request)) {
            Object.assign($keyChild, request)
        }
        Ux.of(reference).in({
            $keyChild
        }).handle(() => Ux.fn(reference).rxFlag(refresh));
        // Ux.of(reference).in({
        //     /*
        //      * $keyChild 数据结构
        //      */
        //     $keyChild: $keyUp
        // }).handle(() => {
        //     Ux.fn(reference).rxFlag(undefined !== $keyUp);
        // });
    },
    /*
     * 重写事件这一层，包含两种事件处理
     * 1）组件本身的事件处理
     * 2）是否调用父类的事件处理（父类方法调用）
     */
    // ExChildXXX -> Build $child of resource
    /*
     * resource = {
     *     owner,
     *     ownerType,
     *     resource: {
     *         rest1: {
     *         }
     *     }
     * }
     */
    rxFlagFn: (reference) => ($refresh) => {
        Ux.of(reference).in({
            $refresh
        }).done();
    },
    rxSubmitFn: (reference, region = {}) => ($loading = true) => {
        if ($loading) {
            // 提交中
            Ux.of(reference).in({
                $paging: true
            }).loading(false).done();
        } else {
            // 提交完成
            let $modal = Ux.fromHoc(reference, "modal");
            $modal = Ux.clone($modal);
            const params = {};
            const {$inited = {}} = reference.props;
            if ($inited.data) {
                params.owner = $inited.data.name;
            }
            params.region = region.label;
            $modal.content = Ux.formatExpr($modal.content, params);
            $modal.onOk = () => {
                Ux.of(reference).in({
                    $paging: false,
                    $refresh: false
                }).load().done();
            };
            const md = Ux.v4Modal();
            md.success($modal);
        }
    }
}