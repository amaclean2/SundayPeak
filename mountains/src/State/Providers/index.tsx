import React, { type ReactNode } from 'react'

import { AdventureStateProvider } from './AdventureStateProvider'
import { CardStateProvider } from './CardStateProvider'
import { UserStateProvider } from './UserStateProvider'
import { MessagingStateProvider } from './MessageStateProvider'
import { TokenStateProvider } from './TokenStateProvider'
import { ZoneStateProvider } from './ZoneStateProvider'

export const SundayPeakProviders = ({ children }: { children: ReactNode }): JSX.Element => (
	<TokenStateProvider>
		<CardStateProvider>
			<UserStateProvider>
				<ZoneStateProvider>
					<AdventureStateProvider>
						<MessagingStateProvider>{children}</MessagingStateProvider>
					</AdventureStateProvider>
				</ZoneStateProvider>
			</UserStateProvider>
		</CardStateProvider>
	</TokenStateProvider>
)
