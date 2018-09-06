const setting = (reference: any) =>
    () => reference.setState({$drawer: true});
const thunderbolt = (reference: any) =>
    () => reference.setState({$connect: true});
export default {
    Tool: {
        setting,
        thunderbolt
    }
}