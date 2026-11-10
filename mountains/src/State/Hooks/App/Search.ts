import type { ShortAdventure } from '../../Types/Adventures'
import type { ShortUser } from '../../Types/User'
import type { ZoneSearchElement } from '../../Types/Zones'
import { fetcher } from '../../utils'
import { searchApi } from '../Apis'

type SearchUserDef = ({
	userId,
	searchText,
	amongFriends
}: {
	userId: number
	searchText: string
	amongFriends: boolean
}) => Promise<ShortUser[]>

type SearchAdventureDef = ({
	parentZoneId,
	searchText
}: {
	parentZoneId: number
	searchText: string
}) => Promise<ShortAdventure[]>

type SearchZoneDef = ({
	parentZoneId,
	searchText
}: {
	parentZoneId: number
	searchText: string
}) => Promise<ZoneSearchElement[]>

export const useSearch = (): {
	searchUsers: SearchUserDef
	searchAdventures: SearchAdventureDef
	searchZones: SearchZoneDef
} => {
	const searchUsers = async ({
		userId,
		searchText,
		amongFriends = false
	}: {
		userId: number
		searchText: string
		amongFriends: boolean
	}): Promise<ShortUser[]> => {
		try {
			const {
				data: { searchResults }
			} = await fetcher(
				`${
					searchApi.searchForUser.url
				}?id=${userId}&friends=${amongFriends.toString()}&q=${searchText}`,
				{
					method: searchApi.searchForUser.method
				}
			)

			return searchResults
		} catch (error) {
			console.log(error)
			return [] as ShortUser[]
		}
	}

	const searchAdventures = async ({
		parentZoneId,
		searchText
	}: {
		parentZoneId: number
		searchText: string
	}): Promise<ShortAdventure[]> => {
		try {
			const parentZoneBlock = parentZoneId !== undefined ? `&id=${parentZoneId}` : ''
			const {
				data: { searchResults }
			} = await fetcher(`${searchApi.searchForAdventure.url}?q=${searchText}${parentZoneBlock}`)

			return searchResults
		} catch (error) {
			console.log(error)
			return [] as ShortAdventure[]
		}
	}

	const searchZones = async ({
		parentZoneId,
		searchText
	}: {
		parentZoneId: number
		searchText: string
	}): Promise<ZoneSearchElement[]> => {
		try {
			const parentZoneBlock = parentZoneId !== undefined ? `&id=${parentZoneId}` : ''
			const {
				data: { searchResults }
			} = await fetcher(`${searchApi.searchForZone.url}?q=${searchText}${parentZoneBlock}`)

			return searchResults
		} catch (error) {
			console.log(error)
			return [] as ZoneSearchElement[]
		}
	}

	return {
		searchUsers,
		searchAdventures,
		searchZones
	}
}
