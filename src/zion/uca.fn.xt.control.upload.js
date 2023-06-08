import __Zn from './zero.module.dependency';
import __V_IMAGE from './variant-image';
import {saveAs} from "file-saver";
import {Upload} from 'antd';

const Cv = __Zn.Env;

const _rxPreview = (reference) => (file = {}) => {
    if (file.hasOwnProperty(Cv.K_NAME._FILE_OBJ_ORIGIN)) {
        saveAs(file.originFileObj, file.name);
    } else {
        const {ajax = {}} = reference.props;
        __Zn.ajaxDownload(ajax.download, __Zn.clone(file), {})
            .then(data => saveAs(data, file.name));
    }
}

const _rxBeforeUpload = (reference, metadata = {}) => (file = {}) => {
    const {single = true, overwrite = false} = metadata;
    const {config = {}} = reference.props;
    const error = __Zn.fromHoc(reference, "error");
    // 1. 单多文件上传
    const {$counter = 0} = reference.state;
    /*
     * 数据说明
     * metadata
     * -- single：           是否单文件上传，如果是单文件上传，则必须验证单文件。
     * props.config
     * -- filekey：          后端 X_ATTACHMENT 中的 FILE_KEY 提取的字段名
     * -- limit：            文件上传的大小限制
     * -- reduce：           文件重名检查（默认true）
     */

    // 1. 单文件上传在 overwrite 不允许覆盖为 false（默认）时，验证上传文件是不是超过了文件限制
    if (single && !overwrite) {
        // 单文件验证
        if (0 < $counter) {
            __Zn.messageFailure(error.single);
            return Upload.LIST_IGNORE;
            // return Promise.reject({error: error.single});
        }
    }


    // 2. 文件大小限制，必须保证文件限制问题
    if (config.limit) {
        const current = file.size;
        const limitation = config.limit * 1024;
        if (limitation < current) {
            const messageContent = __Zn.formatExpr(error.limit, {
                size: __Zn.toFileSize(limitation, null),
                current: __Zn.toFileSize(current, null)
            });
            __Zn.messageFailure(messageContent);
            return Upload.LIST_IGNORE;
            // return Promise.reject({error: messageContent});
        }
    }
    // 3. 重名文件检查
    if (config.reduce) {
        const {fileList = []} = reference.state;
        const name = fileList.map(each => each.name);
        if (name.includes(file.name)) {
            __Zn.messageFailure(error.reduce);
            return Upload.LIST_IGNORE; // Promise.reject({error: error.reduce});
        }
        // 外置函数判断（当前目录下的文件集）
        const validated = __Zn.fn(reference, false).rxReduce(file);
        if (validated) {
            __Zn.messageFailure(validated);
            return Upload.LIST_IGNORE;
            // return Promise.reject({error: validated});
        }
    }
    return __Zn.promise(file);
}
const _rxCustomRequest = (reference) => (params = {}) => {
    const {ajax = {}} = reference.props;
    if (__Zn.isEmpty(ajax)) {
        const error = __Zn.fromHoc(reference, "error");
        __Zn.messageFailure(error.ajax);
        return Promise.reject({error: error.ajax});
    } else {
        return _rxAction(reference, ajax, params).then(response => {
            return params.onSuccess(response);
        })
    }
}
const _rxAction = (reference, ajax = {}, params) => {
    let request = __Zn.clone(ajax.params);

    // 提取Form引用（参数核心引用）
    const ref = __Zn.onReference(reference, 1);

    request = __Zn.parseInput(request, ref);
    // 处理 directory
    const {directory} = request;
    if (directory && directory.startsWith("/")) {
        /*
         * 判断不同情况的 directory 处理
         * 1）文档管理中直接提取
         * 2）静态模块中不带 /xc 路由，和情况 1) 比对计算
         * 3）流程上传中专用（服务目录类型）
         * 4）新版本中由于增加了 SVN 配置表，所以在提取文档过程中重新修订目录规范如：
         *
         * 由原来的          /xc
         * 修改成新的：       /xc/document
         */
        const {formula} = request;
        const {$app} = ref.props;

        // 1. storePath 从应用中来，上传专用
        let prefix;
        if ($app) {
            prefix = $app._("storePath");
        } else {
            prefix = `/${Cv.ROUTE}`;
        }

        // 2. 目录计算
        let joined;
        if (directory.startsWith(prefix)) {
            joined = directory;
        } else {
            joined = `${prefix}${directory}`;
        }

        // 3. 最终目录计算
        let directoryResult;
        if (formula) {
            directoryResult = `\`${joined}${formula}\``;
        } else {
            directoryResult = joined;
        }
        request.directory = directoryResult;
        // request.directory = T.encryptMD5(request.directory);
    }
    const uri = __Zn.formatExpr(ajax.uri, request);
    return __Zn.ajaxUpload(uri, params.file);
}
const _rxChange = (reference, metadata) => (params = {}) => {
    const {file = {}} = params;
    const state = {
        $counter: params.fileList.length    // 已上传文件数量
    };
    state.fileList = params.fileList.map(item => {
        if (item.response) {
            return item.response;
        } else return item;
    })
    // const state = __Zn.clone(reference.state);
    // Object.assign(state, {
    //     fileList: params.fileList,          // 已上传文件列表
    //     $counter: params.fileList.length    // 已上传文件数量
    // })
    let of = __Zn.of(reference).in(state);
    if ("uploading" === file.status) {
        of = of.loading(false);
        // state.$loading = true;
    } else if ("done" === file.status) {
        // 如果listType为picture-card
        const {listType} = reference.props;
        if (__Zn.Env.TYPE_UPLOAD.CARD === listType) {
            // 图片格式处理
            const {originFileObj} = file;
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                __Zn.of(reference).in({
                    // $loading: false,            // 加载完成
                    $imageUrl: reader.result,   // 图片URL地址
                }).load(false).done();
                // reference.?etState({
                //     $loading: false,            // 加载完成
                //     $imageUrl: reader.result,   // 图片URL地址
                // })
            });
            if (originFileObj) {
                reader.readAsDataURL(originFileObj);
            }
        }

        of = of.load(false);
        // state.$loading = false;
    }
    // 始终更新fileList（onChange触发两次，防止beforeUpload问题）
    of.handle(() => {
        // 设置更新过后的基础数据
        const {config = {}} = reference.props;
        const field = config['filekey'] ? config['filekey'] : "key";
        /*
         * XAttachment + File
         * 后端标准化 + 前端标准化构成整体数据
         * 前端字段
         * - uid
         * - name
         * - type
         * - size
         * 后端
         * - key
         * - fileKey
         * - fileName
         * - filePath
         * - fileUrl
         * - size
         * - mime
         * - status
         * - storeWay
         * - modelId
         * - metadata
         * - name
         * - type
         * - extension
         * - sizeUi
         */
        const fileData = [];
        // eslint-disable-next-line no-unused-vars
        const {
            single = true,      // 单文件上传
            overwrite = false,  // 单文件覆盖上传
        } = metadata;
        const {fileList = []} = params;
        fileList.filter(file => file.hasOwnProperty('response')).map(item => {
            const {response = {}} = item;
            const each = __Zn.clone(response);
            each.uid = item.uid;
            each.name = item.name;
            each.key = item.response[field];
            each.type = item.type;  // 数据类型
            // linker process
            each.size = item.size;
            each.sizeUi = __Zn.toFileSize(item.size);
            return each;
        }).forEach(file => {
            if (single && overwrite) {
                // 覆盖上传
                fileData[0] = file;
            } else {
                // 正常上传
                fileData.push(file)
            }
        });
        const ref = __Zn.onReference(reference, 1);
        if (ref) {
            if (single) {
                // 单文件
                const file = fileData[0] ? fileData[0] : {};
                const formValues = {};
                __Zn.writeLinker(formValues, config, () => file);
                __Zn.formHits(ref, formValues);
            }
            __Zn.fn(reference).onChange(fileData);
        }
    })
    // reference.?etState(state);
    //
    // // 设置更新过后的基础数据
    // const {config = {}} = reference.props;
    // const field = config['filekey'] ? config['filekey'] : "key";
    // /*
    //  * XAttachment + File
    //  * 后端标准化 + 前端标准化构成整体数据
    //  * 前端字段
    //  * - uid
    //  * - name
    //  * - type
    //  * - size
    //  * 后端
    //  * - key
    //  * - fileKey
    //  * - fileName
    //  * - filePath
    //  * - fileUrl
    //  * - size
    //  * - mime
    //  * - status
    //  * - storeWay
    //  * - modelId
    //  * - metadata
    //  * - name
    //  * - type
    //  * - extension
    //  * - sizeUi
    //  */
    // const fileData = [];
    // // eslint-disable-next-line no-unused-vars
    // const {
    //     single = true,      // 单文件上传
    //     overwrite = false,  // 单文件覆盖上传
    // } = metadata;
    // const {fileList = []} = params;
    // fileList.filter(file => file.hasOwnProperty('response')).map(item => {
    //     const {response = {}} = item;
    //     const each = __Zn.clone(response);
    //     each.uid = item.uid;
    //     each.name = item.name;
    //     each.key = item.response[field];
    //     each.type = item.type;  // 数据类型
    //     // linker process
    //     each.size = item.size;
    //     each.sizeUi = __Zn.toFileSize(item.size);
    //     return each;
    // }).forEach(file => {
    //     if (single && overwrite) {
    //         // 覆盖上传
    //         fileData[0] = file;
    //     } else {
    //         // 正常上传
    //         fileData.push(file)
    //     }
    // });
    // const ref = __Zn.onReference(reference, 1);
    // if (ref) {
    //     if (single) {
    //         // 单文件
    //         const file = fileData[0] ? fileData[0] : {};
    //         const formValues = {};
    //         __Zn.writeLinker(formValues, config, () => file);
    //         __Zn.formHits(ref, formValues);
    //     }
    //     __Zn.fn(reference).onChange(fileData);
    // }
}
const xtUploadHandler = (reference, metadata = {}) => {
    const handler = {};
    // 前置验证处理
    handler.beforeUpload = _rxBeforeUpload(reference, metadata);
    // 上传改变处理
    handler.onChange = _rxChange(reference, metadata);
    handler.onPreview = _rxPreview(reference);
    handler.customRequest = _rxCustomRequest(reference);
    // 追加个人删除属性
    const {rxRemove} = reference.props;
    if (__Zn.isFunction(rxRemove)) {
        const rx2Remove = rxRemove(reference);
        if (__Zn.isFunction(rx2Remove)) {
            handler.onRemove = (item) => {
                const checked = rx2Remove(item.response);
                // 异步
                if (Promise.prototype.isPrototypeOf(checked)) {
                    return checked;
                }
                // 同步检查
                if (checked) {
                    return checked;
                } else {
                    const error = __Zn.fromHoc(reference, "error");
                    __Zn.messageFailure(error.self);
                    return false;
                }
            };
        }
    }
    return handler;
}
const xtUploadInit = (reference, ajax = {}, callback) => {
    const {value = [], listType} = reference.props;
    if (!callback) {
        callback = () => false;
    }
    if ("picture-card" === listType) {
        // 图片专用
        __Zn.parallel(value.map(file => {
            return __Zn.ajaxDownload(ajax.download, __Zn.clone(file), {});
        })).then(downloaded => {
            const promises = [];
            value.forEach((each, index) =>
                promises.push(__Zn.asyncImage(each, downloaded[index])));
            return __Zn.parallel(promises)
        }).then(item => callback(item))
    } else {
        value.forEach(each => each.url = __Zn.formatExpr(ajax.download, each, true));
        callback(value);
    }
}
const xtUploadMime = (value = []) => {
    const normalized = [];
    const fnThumb = (item = {}) => {
        const name = item.name;
        const extension = name.substring(name.lastIndexOf(".") + 1).toUpperCase();
        const type = __V_IMAGE.ICON_FILE[extension];
        if (type) {
            return type;
        } else {
            return __V_IMAGE.ICON_FILE.TXT;
        }
    }
    value.forEach(item => {
        if (item.hasOwnProperty("originFileObj")) {
            item.thumbUrl = fnThumb(item);
            normalized.push(item);
        } else {
            const file = {};
            file.key = item.key;
            file.uid = item.uid ? item.uid : item['fileKey'];
            file.type = item.type;
            file.thumbUrl = fnThumb(item);
            file.status = "done";
            file.response = __Zn.clone(item);
            file.percent = 0;
            file.name = item.name;
            normalized.push(file);
        }
    })
    return normalized;
}

export default {
    // 下载专用几个方法，合并到一起形成 handler
    xtUploadHandler,
    xtUploadInit,
    xtUploadMime,
}