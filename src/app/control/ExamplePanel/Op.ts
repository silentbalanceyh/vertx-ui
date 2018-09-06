const setting = (reference: any) =>
    () => reference.setState({$drawer: true});
const cluster = (reference: any) => (key) => {
    console.info(key);
};
const search = (reference: any) => (key) => {

};
const thunderbolt = (reference: any) =>
    () => reference.setState({$connect: true});
export default {
    Tool: {
        setting,
        thunderbolt,
        search,
        cluster,
    }
}