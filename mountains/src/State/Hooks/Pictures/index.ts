import { useAdventureStateContext } from '../../Providers/AdventureStateProvider'
import { useUserStateContext } from '../../Providers/UserStateProvider'
import type { URLType } from '../../Types/Cards'
import { fetcher } from '../../utils'
import { picturesApi } from '../Apis'

export const usePictures = (): {
	savePicture: ({
		isProfilePicture,
		isAdventure,
		formData
	}: {
		isProfilePicture: boolean
		isAdventure: boolean
		formData: FormData
	}) => void
	deletePicture: ({ url }: { url: URLType }) => void
} => {
	const { userDispatch } = useUserStateContext()
	const { adventureDispatch } = useAdventureStateContext()

	const savePicture = ({
		isProfilePicture,
		isAdventure,
		formData
	}: {
		isProfilePicture: boolean
		isAdventure: boolean
		formData: FormData
	}): void => {
		try {
			if (isProfilePicture !== undefined && isProfilePicture) {
				// handle profile image
				fetcher(picturesApi.changeProfilePicture.url, {
					method: picturesApi.changeProfilePicture.method,
					headers: [{ name: 'content-type', value: 'none' }],
					body: formData
				}).then(({ data }) => {
					userDispatch({ type: 'updateProfileImage', payload: data.path })
				})
			} else {
				// handle user and adventure images
				fetcher(picturesApi.upload.url, {
					method: picturesApi.upload.method,
					headers: [{ name: 'content-type', value: 'none' }],
					body: formData
				}).then(({ data }) => {
					userDispatch({ type: 'updateImages', payload: data.path })
					if (isAdventure !== undefined && isAdventure) {
						adventureDispatch({ type: 'updateAdventureImages', payload: data.path })
					}
				})
			}
		} catch (error) {
			userDispatch({ type: 'setUserError', payload: 'failed adding image' })
			throw error
		}
	}

	const deletePicture = async ({ url }: { url: URLType }): Promise<void> => {
		try {
			console.log({ url })
			await fetcher(picturesApi.delete.url, {
				method: picturesApi.delete.method,
				body: { url }
			})

			userDispatch({ type: 'deleteImage', payload: url })
			adventureDispatch({ type: 'deleteAdventureImage', payload: url })
		} catch (error) {
			userDispatch({ type: 'setUserError', payload: 'failed deleting the image' })
			throw error
		}
	}

	return {
		savePicture,
		deletePicture
	}
}
