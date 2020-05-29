import command from './Web.Fn.Cmd';
import renderPalette from './Web.Fn.Palette';
import renderStatus from './Web.Fn.Status';
import renderDrawer from './Web.Fn.Cmd.Drawer';

export default {
    ...command,
    renderPalette,
    renderStatus,
    renderDrawer,
}