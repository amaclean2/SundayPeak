import React from 'react'

import { AdventureStateProvider } from './AdventureStateProvider'
import { CardStateProvider } from './CardStateProvider'
import { UserStateProvider } from './UserStateProvider'
import { MessagingStateProvider } from './MessageStateProvider'
import { TokenStateProvider } from './TokenStateProvider'
import { ReactNode } from 'react'

export const SundayPeakProviders = ({ children }: { children: ReactNode }) => (
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
