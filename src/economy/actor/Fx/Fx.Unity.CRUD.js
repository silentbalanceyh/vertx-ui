import U from "underscore";

const doDelete = (reference, executor, input) => deleted => {
    if (deleted) {
        if (U.isFunction(executor)) {
            executor(deleted, input);
        } else {
            return Promise.reject("[Ex] 删除回调缺失！");
        }
    } else {
        return Promise.reject(`[Ex] 删除有问题 id = ${U.isArray(input) ? JSON.stringify(input) : input}`);
    }
};

const doUpdate = (reference, executor, records) => response => {
    if (U.isFunction(executor)) {
        executor(response, records);
    } else {
        return Promise.reject("[Ex] 更新回调缺失！");
    }
};

export default {
    doDelete,
    doUpdate,
};