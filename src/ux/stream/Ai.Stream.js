import Tab from './Ai.Stream.Tab';
import Table from './Ai.Stream.Table';
import Mock from './Ai.Stream.Mock';

class Stream {
    constructor(reference) {
        if (!reference) {
            console.error("[ZI] Input 'reference' must be valid.")
        }
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