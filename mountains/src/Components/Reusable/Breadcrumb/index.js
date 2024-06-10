import { useAdventureStateContext, useZoneStateContext } from '@amaclean2/sundaypeak-treewells'
import { Fragment, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../Button'

import './styles.css'
import BreadcrumbSeparator from 'Images/UIGlyphs/BreadcrumbSeparator'

const Breadcrumb = () => {
	const { currentAdventure } = useAdventureStateContext()
	const { currentZone } = useZoneStateContext()
	const { adventureId } = useParams()
	const [dropOpen, setDropOpen] = useState(false)

	const breadcrumb = useMemo(() => {
		const bc = adventureId ? currentAdventure.breadcrumb : currentZone.breadcrumb
		if (!bc) {
			return []
		}

		return bc.length > 2
			? bc
					.filter((_, idx) => idx <= 1 || idx === bc.length - 1)
					.map((it, idx) => (idx === 1 ? { ...it, name: '...' } : it))
			: bc
	}, [currentAdventure, currentZone])

	const overflowCrumbs = useMemo(() => {
		const bc = adventureId ? currentAdventure.breadcrumb : currentZone.breadcrumb
		return bc?.filter((_, idx) => ![0, bc.length - 1].includes(idx))
	}, [currentAdventure, currentZone])

	if (breadcrumb.length <= 1) return null

	return (
		<div className={'bread-crumb flex-box'}>
			{breadcrumb.map((bc, idx) => (
				<Fragment key={`bc_${idx}`}>
					{idx === 0 ? (
						<span>{bc.name}</span>
					) : (
						<>
							<BreadcrumbSeparator color='#02AD85' />
							{idx === 1 && breadcrumb.length > 2 ? (
								<Button
									direction={''}
									className={'expandable-bc'}
									onClick={() => setDropOpen(true)}
									type={'link'}
								>
									{bc.name}
								</Button>
							) : (
								<Button
									direction={`/zone/${bc.id}`}
									type={'link'}
								>
									{bc.name}
								</Button>
							)}
						</>
					)}
				</Fragment>
			))}
			{dropOpen && (
				<>
					<div
						className={'expanded-bc-background'}
						onClick={() => setDropOpen(false)}
					/>
					<div className={'expanded-bc flex-box'}>
						{overflowCrumbs.map((bc, idx) => (
							<Button
								key={`bc_expanded_${idx}`}
								className={'expanded-bc-link'}
								id={`expanded-bc-${idx}`}
								direction={`/zone/${bc.id}`}
							>
								{bc.name}
							</Button>
						))}
					</div>
				</>
			)}
		</div>
	)
}

export default Breadcrumb
