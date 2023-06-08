import command from './web.cmd';
import renderPalette from './web.palette';
import renderStatus from './web.status';
import renderDrawer from './web.cmd.drawer';

export default {
    ...command,
    renderPalette,
    renderStatus,
    renderDrawer,
}