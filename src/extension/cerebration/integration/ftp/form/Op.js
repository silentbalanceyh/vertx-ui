import Ex from 'ex';
import Ux from 'ux';

const $opAdd = (reference) => (params) => Ex.form(reference).add(params, {
    uri: "/api/i-integration",
    dialog: "added",
});
const $opSave = (reference) =>
    params => Ex.form(reference).save(params, {
        uri: "/api/i-integration/:key",
        dialog: "saved"
    });
const $opDelete = (reference) =>
    params => Ex.form(reference).remove(params, {
        uri: "/api/i-integration/:key",
        dialog: "removed"
    });
const $opFilter = (reference) =>
    params => Ex.form(reference).filter(params);

const toUri = (reference) => (event) => {
    Ux.prevent(event);
    const params = Ux.formGet(reference, [
        "hostname", "port", "username", "password", "path"
    ]);
    const {
        username,
        password,
        port,
        hostname,
        path,
    } = params;

    // 主机和地址部分
    if (hostname) {
        // 主机地址部分（域名 + 端口）
        let partHost = hostname;
        if (port) {
            partHost = `${partHost}:${port}`
        }

        // 账号密码部分
        let partAccount = "";
        if (username && password) {
            partAccount = `${username}:${password}@`;
        }

        // 路径部分
        let partPath = path ? path : "/";
        if (!partPath.startsWith("/")) {
            partPath = `/${partPath}`
        }
        const endpoint = `ftp://${partAccount}${partHost}${partPath}`;
        Ux.formHit(reference, 'endpoint', endpoint);
    }
}
export default {
    actions: {
        $opAdd,
        $opSave,
        $opDelete,
        $opFilter
    },
    renders: {
        // 域名
        hostname: (reference, jsx) => {
            jsx.onBlur = toUri(reference);
            return Ux.aiInput(reference, jsx)
        },
        // 端口
        port: (reference, jsx) => {
            jsx.onBlur = toUri(reference);
            return Ux.aiInputNumber(reference, jsx)
        },
        // 账号
        username: (reference, jsx) => {
            jsx.onBlur = toUri(reference);
            return Ux.aiInput(reference, jsx)
        },
        // 密码
        password: (reference, jsx) => {
            jsx.onBlur = toUri(reference);
            return Ux.aiPassword(reference, jsx)
        },
        // 根路径
        path: (reference, jsx) => {
            jsx.onBlur = toUri(reference);
            return Ux.aiInput(reference, jsx)
        }
    }
}