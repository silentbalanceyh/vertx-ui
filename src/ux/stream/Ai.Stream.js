import Tab from './Ai.Stream.Tab';
import Table from './Ai.Stream.Table';
import Mock from './Ai.Stream.Mock';
import E from '../Ux.Error';

class Stream {
    constructor(reference) {
        E.fxTerminal(!reference, 10049, reference);
        this.reference = reference;
    }

    tabs() {
        return new Tab(this.reference);
    }

    table() {
        return new Table(this.reference);
    }

    mock() {
        return new Mock(this.reference);
    }
}

export default Stream;