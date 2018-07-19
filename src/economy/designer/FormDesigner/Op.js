import OpDnd from './Op.Dnd'
import OpLayout from './Op.Layout'

export default {
    ...OpDnd,
    ...OpLayout,
    DragTypes: {
        FormDesigner: "FormDesigner"
    }
}