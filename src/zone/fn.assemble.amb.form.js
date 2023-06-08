import __Of from './o.silver.bullet.of';
import __At from './fn.atomic.async';

const ambFormSubmit = (reference) => {
    const {$submitting, rxSubmitting} = reference.props;
    if (undefined === $submitting) {
        /*
         * reference.setState({$submitting: true});
         */
        return __Of.of(reference).submitting().future();
    } else {
        if (rxSubmitting) {
            return __Of.of(reference)._.submitting();
        } else {
            return __At.promise({});
        }
    }
}

const ambFormEnd = (reference, state = {}) => {
    const {$submitting} = reference.props;
    if (undefined === $submitting) {
        /*
         * reference.setState({$submitting: false});
         */
        return __Of.of(reference).in(state).submitted().future();
    } else {
        return __Of.of(reference)._.submitted(state);
    }
}

export default {
    ambFormSubmit,
    ambFormEnd,
}