// Feature flags, set at build time with REACT_APP_FEATURE_* env vars (see .env.dev / .env.build)
const isOn = (value) => value?.trim() === 'true'

export const featureFlags = {
	conversations: isOn(process.env.REACT_APP_FEATURE_CONVERSATIONS)
}
