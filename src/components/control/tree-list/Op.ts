const opItemDelete = (reference: any) => (item: any, impactKeys: any = []) => {
    console.info("删除", item, impactKeys);
};

const opItemEdit = (reference: any) => (item: any, impactKeys: any = []) => {
    console.info("编辑", item, impactKeys);
};

const opItemAdd = (reference: any) => (item: any, impactKeys: any = []) => {
    console.info("添加", item, impactKeys);
};

export default {
    opItemDelete,
    opItemAdd,
    opItemEdit,
}