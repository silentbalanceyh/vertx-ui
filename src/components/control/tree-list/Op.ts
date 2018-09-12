const opItemDelete = (reference: any) => (item: any, impactKeys: any = []) => {
    console.info(item, impactKeys);
};

const opItemEdit = (reference: any) => (item: any, impactKeys: any = []) => {
    console.info(item, impactKeys);
};

const opItemAdd = (reference: any) => (item: any, impactKeys: any = []) => {
    console.info(item, impactKeys);
};

export default {
    opItemDelete,
    opItemAdd,
    opItemEdit,
}