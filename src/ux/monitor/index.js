import Tool from './Mt.Tool'
import Parser from './Mt.Parser'
import Writer from './Mt.Writer'
import Logger from './Mt.Logger'

export default {
    ...Tool,
    ...Parser,
    ...Writer,
    Logger,
}