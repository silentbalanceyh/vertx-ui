import Ux from "ux";

const rxOpenFn = (reference) => (id, record = {}) => {
    const name = Ux.toQuery("name");
    const uri = `/workflow/history?name=${name}`
    const {$router} = reference.props;
    const {
        $qbe,
        $query,
        $qr,
    } = reference.state;
    const __state = JSON.stringify({$qbe, $query, $qr})
    Ux.toRoute(reference, uri, {
        target: $router.path(),
        _tid: record.key,
        __state
    });
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    yoExecutor: (reference) => ({
        // 查看
        fnView: rxOpenFn(reference)
    })
}