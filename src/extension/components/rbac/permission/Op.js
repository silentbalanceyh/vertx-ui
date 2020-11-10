import Ux from 'ux';

const yiPage = (reference) => {
    const state = {};
    // 警告信息
    state.$alert = Ux.fromHoc(reference, "alert");
    state.$ready = true;
    // 应用信息
    const apps = Ux.fromHoc(reference, "apps");
    if (Ux.isArray(apps)) {
        apps.forEach(app => {
            // 构造链接信息
            app.uri = `/authority/${app.key}?`
                // 目标页面
                + `target=${Ux.encryptBase64("/rbac/permission")}`;
        });
        state.$apps = apps;
    }
    reference.setState(state);
}

export default {
    yiPage
}