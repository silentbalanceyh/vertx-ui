import Form from './I.dragging';
import Row from './I.dragging.row';
import Cell from './I.dragging.cell';

export default {
    Form,
    Row,
    Cell,
    /* 这两个事件会在拖拽过程中报错 */
    sourceFix: {
        onItemHover: (event) => {

        },
        onClick: (event) => {

        }
    }
};