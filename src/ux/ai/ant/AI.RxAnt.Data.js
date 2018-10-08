const mock = (jsx = {}, reference) => {
    const {config = {}} = jsx;
    if (config.mock) {
        const {mock = {}} = reference.state;
        jsx.mock = mock[config.mock];
    }
};
export default {
    mock
};