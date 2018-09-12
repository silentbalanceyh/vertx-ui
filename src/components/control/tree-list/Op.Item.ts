import Ux from "ux";

const opItemDelete = (reference: any) => (item: any, impactKeys: any = []) => {
    console.info("删除", item, impactKeys);
    Ux.rdxTree(reference, item, true);
};

const opItemEdit = (reference: any) => (item: any, impactKeys: any = []) => {
    console.info("编辑", item, impactKeys);
    Ux.rdxTree(reference, item);
};

const opItemAdd = (reference: any) => (item: any, impactKeys: any = []) => {
    console.info("添加", item, impactKeys);
    Ux.rdxTree(reference, item);
};


const opAddRow = (reference: any) => (record: any, id: any, fnClose) => {
    // 行保存专用方法
    console.info(record, id);
    if (fnClose) {
        fnClose();
    }
};
export default {
    opItemAdd,
    opItemEdit,
    opItemDelete,
    opAddRow
}