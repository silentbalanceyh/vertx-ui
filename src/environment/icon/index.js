export default filename => {
    try {
        return require("./ext/" + filename);
    } catch (error) {
        console.warn(error);
    }
};
