type ApiObject = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE'
	url: string
}

type UserObject = {
	create: ApiObject
	login: ApiObject
	getLoggedIn: ApiObject
	getById: ApiObject
	edit: ApiObject
	searchForUser: ApiObject
	searchForFriend: ApiObject
	followUser: ApiObject
	sendPasswordResetLink: ApiObject
	createNewPassword: ApiObject
	delete: ApiObject
}

type TokenObject = {
	getInitialCall: ApiObject
}

type AdventureObject = {
	create: ApiObject
	getAllAdventures: ApiObject
	getAdventureDetails: ApiObject
	searchForAdventures: ApiObject
	editAdventure: ApiObject
	processAdventureCSV: ApiObject
	builkImport: ApiObject
	deleteAdventure: ApiObject
}

type TodoAdventureObject = {
	create: ApiObject
}
type CompletedAdventureObject = {
	create: ApiObject
}

export const users: UserObject = {
	create: {
		url: '/users/create',
		method: 'POST'
	},
	login: {
		url: '/users/login',
		method: 'POST'
	},
	getLoggedIn: {
		url: '/users/loggedIn',
		method: 'GET'
	},
	getById: {
		url: '/users/id',
		method: 'GET'
	},
	edit: {
		url: '/users/edit',
		method: 'PUT'
	},
	searchForUser: {
		url: '/users/search',
		method: 'GET'
	},
	searchForFriend: {
		url: '/users/friendSearch',
		method: 'GET'
	},
	followUser: {
		url: '/users/follow',
		method: 'GET'
	},
	sendPasswordResetLink: {
		url: '/users/passwordResetLink',
		method: 'POST'
	},
	createNewPassword: {
		url: '/users/newPassword',
		method: 'POST'
	},
	delete: {
		url: '/users/delete',
		method: 'DELETE'
	}
}

export const tokens: TokenObject = {
	getInitialCall: {
		url: '/services/initial',
		method: 'GET'
	}
}

export const adventures: AdventureObject = {
	create: {
		url: '/adventures/create',
		method: 'POST'
	},
	getAllAdventures: {
		url: '/adventures/all',
		method: 'GET'
	},
	getAdventureDetails: {
		url: '/adventures/details',
		method: 'GET'
	},
	searchForAdventures: {
		url: '/adventures/search',
		method: 'GET'
	},
	editAdventure: {
		url: '/adventures/edit',
		method: 'PUT'
	},
	processAdventureCSV: {
		url: '/adventures/processCsv',
		method: 'POST'
	},
	builkImport: {
		url: '/adventures/bulkImport',
		method: 'POST'
	},
	deleteAdventure: {
		url: '/adventures/delete',
		method: 'DELETE'
	}
}

export const todoAdventures: TodoAdventureObject = {
	create: {
		url: '/todo_adventures/create',
		method: 'POST'
	}
}
export const completedAdventures: CompletedAdventureObject = {
	create: {
		url: '/completed_adventures/create',
		method: 'POST'
	}
}
