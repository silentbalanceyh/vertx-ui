const rxDelThird = (reference: any) => (record) => {
    console.info("三级归类", record);
};
const rxDelSecond = (reference: any) => (record) => {
    console.info("二级归类", record);
};
const rxDelFirst = (reference: any) => (record) => {
    console.info("一级归类", record);
};
const rxDelProd = (reference: any) => (record) => {
    console.info("管理项", record);
};

export default {
    rxDelThird,
    rxDelProd,
    rxDelFirst,
    rxDelSecond
}