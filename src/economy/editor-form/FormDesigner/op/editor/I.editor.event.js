import Ux from "ux";
import CellEvent from './I.editor.event.cell';
import RowEvent from './I.editor.event.row';

export default {
    ...RowEvent,
    ...CellEvent,
    rxSettingClose: (reference) => (event) => {
        Ux.prevent(event);
        reference.setState({
            $drawer: undefined,
            $setting: undefined
        })
    }
}
