export default {
    enabled: true,
    multiple: true,
    rubberband: true,
    movable: true,
    showNodeSelectionBox: false,
    filter: (node) => {
        const data = node.getData();
        return !(data && data.parent)
    },
}