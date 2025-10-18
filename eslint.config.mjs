// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    {
        ignores: [
            'node_modules/', // Ignore node_modules
            'dist/', // Ignore the dist folder
        ],
    },
    {
        rules: {
            // "no-console": "warn"
        },
    },
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
)
