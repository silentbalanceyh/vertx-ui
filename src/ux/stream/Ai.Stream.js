import Tab from './Ai.Stream.Tab';
import Table from './Ai.Stream.Table';
import Mock from './Ai.Stream.Mock';
import Query from './Ai.Stream.Query';
import E from '../Ux.Error';

class Stream {
    constructor(reference) {
        this.reference = reference;
    }

    tabs() {
        const reference = this.reference;
        E.fxTerminal(!reference, 10049, reference);
        return new Tab(reference);
    }

    table() {
        const reference = this.reference;
        E.fxTerminal(!reference, 10049, reference);
        return new Table(reference);
    }

    query() {
        const reference = this.reference;
        E.fxTerminal(!reference, 10049, reference);
        return new Query(reference);
    }

    mock() {
        // Mock可以跳过
        return new Mock(this.reference);
    }
}

export default Stream;