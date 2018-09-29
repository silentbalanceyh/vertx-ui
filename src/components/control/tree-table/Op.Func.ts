const rxDelRank = (reference: any) => (record) => {
    console.info("删除归类", record);
};
const rxDelProd = (reference: any) => (record) => {
    console.info("删除管理项", record);
};
const rxDelActivity = (reference: any) => (record) => {
    console.info("删除活动", record);
};
export default {
    rxDelRank,
    rxDelProd,
    rxDelActivity
}