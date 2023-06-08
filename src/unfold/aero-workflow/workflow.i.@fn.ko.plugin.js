import rxActionRow from "./workflow.__.@fn.ko.plugin";

export default (reference) => ({
    yoPlugins: ($workflow) => rxActionRow(reference, $workflow),
})