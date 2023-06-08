import Ux from 'ux';

export default {
    rxAction: (ref) => ({
        $opAdd: (reference) => (params) => {
            // 防重复提交
            Ux.of(reference).submitting();
            const {$inited = {}} = ref.props;
            // 重新构造相关信息
            let values = Ux.valueOk($inited, [
                "language",
                "type",
                "category",
                "visit",
                "visitRole",
                "visitGroup"
            ]);
            Object.assign(values, params);
            values = Ux.valueRequest(values);
            {
                // 特殊字段
                values.visitMode = ["r", "w", "x"];
            }
            return Ux.ajaxPost("/api/i-directory", values);
        },
        $opRename: (reference) => (params) => {
            const {$inited = {}} = ref.props;
            const request = Ux.clone($inited);
            if ($inited.storePath === params.storePath) {
                console.warn("未改变", params, $inited);
                return Ux.promise(request);
            }
            request.storePath = params.storePath;
            request.name = params.name;
            // 防重复提交
            Ux.of(reference).submitting();
            return Ux.ajaxPut("/api/i-directory/:key", request);
        },
        $opUpload: (reference) => (params) => {
            // 防重复提交
            const info = Ux.fromHoc(ref, "info");
            const {files = []} = params;
            if (0 === files.length) {
                Ux.messageFailure(info.empty);
                Ux.formEnd(reference);
                return Promise.reject({error: info.empty});
            } else {
                Ux.of(reference).submitting();
                return Ux.ajaxPost("/api/file/upload", files);
            }
        },
        $opRenameFile: (reference) => (params) => {
            const {$inited = {}} = ref.props;
            const request = Ux.clone($inited);
            if ($inited.storePath === params.storePath) {
                console.warn("未改变", params, $inited);
                return Ux.promise(request);
            }
            request.storePath = params.storePath;
            request.fileName = params.fileName;
            request.name = params.fileName + "." + $inited.extension;
            // 防重复提交
            Ux.of(reference).submitting();
            return Ux.ajaxPut("/api/file/rename", request);
        }
    })
}