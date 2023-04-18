import React, { type ReactNode } from 'react'

import { AdventureStateProvider } from './AdventureStateProvider'
import { CardStateProvider } from './CardStateProvider'
import { UserStateProvider } from './UserStateProvider'
import { MessagingStateProvider } from './MessageStateProvider'
import { TokenStateProvider } from './TokenStateProvider'

export const SundayPeakProviders = ({ children }: { children: ReactNode }): JSX.Element => (
	<TokenStateProvider>
		<CardStateProvider>
			<UserStateProvider>
				<AdventureStateProvider>
					<MessagingStateProvider>{children}</MessagingStateProvider>
				</AdventureStateProvider>
			</UserStateProvider>
		</CardStateProvider>
	</TokenStateProvider>
)
