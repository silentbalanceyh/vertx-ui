import {Shape} from '@antv/x6';

export default {
    anchor: 'center',
    connectionPoint: 'anchor',
    dangling: false,
    highlight: true,
    snap: true,
    createEdge() {
        return new Shape.Edge({
            attrs: {
                line: {
                    stroke: '#1A91FF',
                    strokeWidth: 1,
                    targetMarker: {
                        name: 'classic',
                        size: 8,
                    },
                },
            },
            router: {
                name: 'manhattan',
            },
        })
    },
    validateConnection({
                           sourceView,
                           targetView,
                           sourceMagnet,
                           targetMagnet,
                       }) {
        if (sourceView === targetView) {
            return false
        }
        if (!sourceMagnet) {
            return false
        }
        if (!targetMagnet) {
            return false
        }
        return true
    }
}