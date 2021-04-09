const base = require("@mendix/pluggable-widgets-tools/configs/eslint.ts.base.json");

base["rules"]["@typescript-eslint/ban-ts-ignore"] = "warn";

module.exports = {
    ...base,
    extends: [
        ...base.extends,
        "plugin:react-hooks/recommended"
    ]
};
