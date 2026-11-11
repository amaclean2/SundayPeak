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
	// Layer boundaries (these used to be enforced by separate npm packages):
	// rivers and couloirs reach water only through serviceHandler.js (and its logger),
	// and water never depends on the layers above it.
	'overrides': [
		{
			'files': ['rivers/**/*.js', 'couloirs/**/*.js'],
			'rules': {
				'no-restricted-modules': ['error', {
					'paths': ['../water', '../../water', '../../../water', '../../../../water'],
					'patterns': [
						'**/water/*',
						'!**/water/Config',
						'**/water/Config/*',
						'!**/water/Config/logger*',
						'**/water/index*'
					]
				}]
			}
		},
		{
			'files': ['water/**/*.js'],
			'rules': {
				'no-restricted-modules': ['error', { 'patterns': [
					'**/rivers/**',
					'**/couloirs/**',
					'**/serviceHandler*'
				] }]
			}
		}
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
