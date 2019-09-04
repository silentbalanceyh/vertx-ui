import Ux from 'ux';

export default (reference) => (state = {}) => {
    const {$fabric = {}} = reference.state;
    const fabricNew = Ux.clone($fabric);
    Object.assign(fabricNew, state);
    reference.setState({$fabric: fabricNew});
};