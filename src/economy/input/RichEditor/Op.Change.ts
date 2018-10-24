import Ux from 'ux';

const on2Change = (reference: any) => (source) => {
    // 转换特殊字符
    let literal = source.replace(/(\n(?=(\n+)))+/g, "\\n");
    reference.setState({markdown: literal});
    // console.info(literal);
    Ux.xtChange(reference, literal, true);
};

export default {
    on2Change
}