const setting = (reference: any) =>
    (key) => reference.setState({$drawer: true});
const cluster = (reference: any) => (key) => {
    console.info(key);
};
const search = (reference: any) => (key) => {

};
const thunderbolt = (reference: any) => (key) => {

};
export default {
    Tool: {
        setting,
        thunderbolt,
        search,
        cluster,
    }
}