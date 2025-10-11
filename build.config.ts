import { makeUnbuildConfig } from "./src/unbuild.config";

export default makeUnbuildConfig({
    entries: [
        "src/index",
        "src/tsup.config",
        "src/unbuild.config",
        "src/cli/index",
        "src/presets/index",
    ],
    externals: ["unbuild", "tsup"],
    rollup: {
        emitCJS: false,
    },
});
