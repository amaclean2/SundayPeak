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
				tabWidth: 2,
				useTabs: true,
				singleQuote: true,
				semi: false,
				barcketSpacing: true,
				printWidth: 120,
				trailingComma: 'none'
			}
		],
		'@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
		'@typescript-eslint/no-extraneous-class': 'warn',
		'@typescript-eslint/consistent-type-assertions': 'warn',
		'@typescript-eslint/naming-convention': 'off'
	}
}
