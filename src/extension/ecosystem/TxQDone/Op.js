import Ex from "ex";
import Ux from "ux";

const rxOpenFn = (reference) => (id, record = {}) => {
    const name = Ux.toQuery("name");
    const uri = `/workflow/history?name=${name}`
    const {$router} = reference.props;
    Ux.toRoute(reference, uri, {
        target: $router.path(),
        _tid: record.key,
    });
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    yoExecutor: (reference) => ({
        // 查看
        fnView: rxOpenFn(reference)
    }),
    yoOp: (reference) => ({
        /* 打开流程图专用方法 */
        rxWorkflow: () => Ex.wf(reference).rxHelp
    }),
}