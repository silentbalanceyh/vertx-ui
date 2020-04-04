export default (reference) => {
    const attrs = {};
    const {$auto = false} = reference.state;
    attrs.checked = $auto;
    attrs.onChange = ($auto) =>
        reference.setState({$auto});
    return attrs;
}