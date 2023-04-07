export class Storage {
	// storage needs to be async because the native storage library is async and it's easier
	// to make everything async than everything synchronous
	static storageApi: any | null

	public static setApi(newStorageApi: any): void {
		this.storageApi = newStorageApi
	}

	private static handleUndefinedApi(property: string): void {
		if (Storage.storageApi === null) {
			throw new Error(`Call setApi() before using storage. Calling: ${property}`)
		}
	}

	public static async setItem(name: string, value: string): Promise<void> {
		this.handleUndefinedApi(name)
		return this.storageApi.setItem(name, value)
	}

	public static async getItem(name: string): Promise<string | number | null> {
		this.handleUndefinedApi(name)
		const response = this.storageApi.getItem(name)
		if (response instanceof Promise) {
			return await response
		}
		return response
	}

	public static async removeItem(name: string): Promise<void> {
		this.handleUndefinedApi(name)
		return this.storageApi.removeItem(name)
	}

	public static async clear(): Promise<void> {
		this.handleUndefinedApi('clear')
		return this.storageApi.clear()
	}
}

export class Connections {
	public static restUrl: string
	public static websocketUrl: string
	public static isReady: boolean = false

	public static setConnections(
		backendConnections: { restUrl: string; websocketUrl: string },
		newStorageApi: any
	): void {
		this.restUrl = backendConnections.restUrl
		this.websocketUrl = backendConnections.websocketUrl
		Storage.setApi(newStorageApi)
		this.isReady = true
	}
}
