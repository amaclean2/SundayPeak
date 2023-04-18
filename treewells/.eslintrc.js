module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: ['plugin:react/recommended', 'standard-with-typescript', 'plugin:prettier/recommended'],
	overrides: [],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: true
	},
	plugins: ['react'],
	rules: {
		'prettier/prettier': [
			'warn',
			{
				useTabs: true,
				tabWidth: 2,
				singleQuote: true,
				semi: false,
				barcketSpacing: true,
				printWidth: 100,
				trailingComma: 'none'
			}
		],
		'@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
		'@typescript-eslint/no-extraneous-class': 'warn',
		'@typescript-eslint/consistent-type-assertions': 'warn',
		'@typescript-eslint/naming-convention': 'off',
		'@typescript-eslint/no-confusing-void-expression': 'off',
		'@typescript-eslint/no-misused-promises': 'off',
		'@typescript-eslint/no-floating-promises': 'off'
	}
}
