import OpDnd from './Op.Dnd'
import OpLayout from './Op.Layout'
import OpDisplay from './Op.Display'

export default {
    ...OpDnd,
    ...OpLayout,
    ...OpDisplay,
    DragTypes: {
        FormDesigner: "FormDesigner"
    }
}