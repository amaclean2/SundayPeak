module.exports = {
	'env': {
		'node': true,
		'jest': true,
		'commonjs': true,
		'es2021': true
	},
	'extends': [
		'prettier',
		'eslint:recommended'
	],
	'overrides': [
	],
	'parserOptions': {'ecmaVersion': 'latest'},
	'rules': {
		'prefer-destructuring': [
			'warn'
		],
		'prefer-template': [
			'error'
		],
		'prefer-const': [
			'error',
			{ 'destructuring': 'any' }
		],
		'no-var': [
			'error'
		],
		'prefer-object-spread': [
			'error'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		]
	}
}
