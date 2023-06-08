import __Zn from './zero.module.dependency';
import __O from './lighting.option.__.fn.header';
import __R from './lighting.option.__.fn.reply';
import __I from './lighting.__.fn.ajax.infrastructure';

const Cv = __Zn.Env;
const ajaxUpload = (uri, file, options = {}) => {
    // 构造MultiPart
    const fileData = new FormData();
    fileData.append('file', file);
    // 构造Api和参数
    const api = `${Cv['ENDPOINT']}${uri}`;
    const headers = __O.headerMimeS(options, true);
    const request = new Request(api, {
        ...__O.headerCors(headers, Cv.HTTP_METHOD.POST, options),
        body: fileData
    });
    return __R.replyData(request, fileData);
};
export default {
    ajaxUpload,                                             // 上传
    ajaxDownload: __I.ajaxDown(Cv.HTTP_METHOD.GET),         // GET下载
    ajaxPull: __I.ajaxDown(Cv.HTTP_METHOD.POST),            // POST下载
}