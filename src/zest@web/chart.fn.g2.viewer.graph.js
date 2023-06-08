const g2Pie = ($g, config = {}) => {
    if ($g) {
        const {
            coordinate = {},
        } = config;
        $g.coordinate("theta", {
            radius: 0.9,
            ...coordinate
        }).transpose()
    }
}

const g2Line = ($g, config = {}) => {
    if ($g) {
        const {
            coordinate = {},
            axis = {},
            dim = {},
        } = config;
        const {
            field = "name",
            value = "value",
        } = dim;
        const configF = axis.field ? axis.field : {};
        const configV = axis.value ? axis.value : {};
        $g.axis(field, {
            ...configF,
        })
        $g.axis(value, {
            ...configV
        });
        $g.coordinate("rect", coordinate).transpose()
    }
}

const g2Bar = ($g, config = {}) => {
    if ($g) {
        const {
            axis = {},
            dim = {},
            legend = true,
        } = config;
        const {
            field = "name",
            value = "value",
        } = dim;
        const configF = axis.field ? axis.field : {};
        const configV = axis.value ? axis.value : {};
        $g.axis(field, {
            ...configF,
        })
        $g.axis(value, {
            ...configV
        });
        $g.legend(legend)
    }
}

const g2Broken = ($g, config = {}) => {
    if ($g) {
        const {
            axis = {},
            dim = {},
        } = config;
        const {
            field = "name",
            value = "value",
        } = dim;
        const configF = axis.field ? axis.field : {};
        const configV = axis.value ? axis.value : {};
        $g.axis(field, {
            ...configF,
        })
        $g.axis(value, {
            ...configV
        });
        $g.line().position('name*value').label('value');
        $g.point().position('name*value');
    }
}

const g2MoreLine = ($g, config = {}) => {
    if ($g) {
        const {
            axis = {},
            dim = {},
        } = config;
        const {
            field = "name",
            value = "value",
        } = dim;
        const configF = axis.field ? axis.field : {};
        const configV = axis.value ? axis.value : {};
        $g.axis(field, {
            ...configF,
        })
        $g.axis(value, {
            ...configV
        });

        $g.line()
            .position('name*value')
            .color('module')
            .shape('smooth');
        $g.point()
            .position('name*value')
            .color('module')
            .shape('circle');
    }
}

export default {
    g2Pie,          // Pie
    g2Bar,          // Bar
    g2Line,         // Line
    g2Broken,       // Broken
    g2MoreLine,     // MoreLine
}