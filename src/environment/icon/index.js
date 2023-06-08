export default filename => {
    try {
        return require("./ext/" + filename);
    } catch (error) {
        console.warn("[Env] 图标读取报错，error = ", error);
    }
};
