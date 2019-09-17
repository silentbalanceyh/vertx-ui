import Ajax from '../../ajax';

const company = (reference) => () => {
    reference.setState({$ready: false});
    Ajax.company().then($inited => reference.setState({
        $ready: true, $inited
    })).catch($error => reference.setState({$ready: true, $error}))
};
export default (reference) => ({
    /*
     * 企业信息读取，两个地方需要用到
     * 1）企业信息管理：/organization/company
     * 2）企业信息查看：/personal/company
     */
    company: company(reference)
})