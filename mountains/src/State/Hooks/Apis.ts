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
	getAdventuresByDistance: ApiObject
	editAdventure: ApiObject
	editAdventurePath: ApiObject
	processAdventureCSV: ApiObject
	builkImport: ApiObject
	deleteAdventure: ApiObject
	deletePath: ApiObject
	createTodo: ApiObject
	completeAdventure: ApiObject
}

type ZoneObject = {
	create: ApiObject
	getAllZones: ApiObject
	getZoneDetails: ApiObject
	getZonesByDistance: ApiObject
	editZone: ApiObject
	addChild: ApiObject
	removeChild: ApiObject
	deleteZone: ApiObject
}

type PicturesObject = {
	upload: ApiObject
	delete: ApiObject
	deleteProfilePicture: ApiObject
	changeProfilePicture: ApiObject
}

type ConversationsObject = {
	create: ApiObject
	getConversations: ApiObject
	addUserToConversation: ApiObject
}

type SearchObject = {
	searchForUser: ApiObject
	searchForAdventure: ApiObject
	searchForZone: ApiObject
}

export const usersApi: UserObject = {
	create: {
		url: '/users',
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
		url: '/users',
		method: 'PUT'
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
		url: '/users',
		method: 'DELETE'
	}
}

export const tokensApi: TokenObject = {
	getInitialCall: {
		url: '/services/initial',
		method: 'GET'
	}
}

export const zonesApi: ZoneObject = {
	create: {
		url: '/zones',
		method: 'POST'
	},
	getAllZones: {
		url: '/zones/all',
		method: 'GET'
	},
	getZoneDetails: {
		url: '/zones/details',
		method: 'GET'
	},
	getZonesByDistance: {
		url: '/zones/distance',
		method: 'GET'
	},
	editZone: {
		url: '/zones',
		method: 'PUT'
	},
	addChild: {
		url: '/zones/child',
		method: 'POST'
	},
	removeChild: {
		url: '/zones/child',
		method: 'DELETE'
	},
	deleteZone: {
		url: '/zones',
		method: 'DELETE'
	}
}

export const searchApi: SearchObject = {
	searchForUser: {
		url: '/search/users',
		method: 'GET'
	},
	searchForAdventure: {
		url: '/search/adventures',
		method: 'GET'
	},
	searchForZone: {
		url: '/search/zones',
		method: 'GET'
	}
}

export const adventuresApi: AdventureObject = {
	create: {
		url: '/adventures',
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
	getAdventuresByDistance: {
		url: '/adventures/distance',
		method: 'GET'
	},
	editAdventure: {
		url: '/adventures',
		method: 'PUT'
	},
	editAdventurePath: {
		url: '/adventures/path',
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
		url: '/adventures',
		method: 'DELETE'
	},
	deletePath: {
		url: '/adventures/path',
		method: 'DELETE'
	},
	createTodo: {
		url: '/adventures/todo',
		method: 'POST'
	},
	completeAdventure: {
		url: '/adventures/complete',
		method: 'POST'
	}
}

export const picturesApi: PicturesObject = {
	upload: {
		url: '/pictures',
		method: 'POST'
	},
	delete: {
		url: '/pictures/delete',
		method: 'PUT'
	},
	changeProfilePicture: {
		url: '/pictures/changeProfilePicture',
		method: 'PUT'
	},
	deleteProfilePicture: {
		url: '/pictures/deleteProfilePicture',
		method: 'PUT'
	}
}

export const conversationsApi: ConversationsObject = {
	getConversations: {
		url: '/conversations',
		method: 'GET'
	},
	create: {
		url: '/conversations',
		method: 'POST'
	},
	addUserToConversation: {
		url: '/conversations/addUser',
		method: 'POST'
	}
}
