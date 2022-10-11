export const placeholderDefinition = ({ placeholder, hideLabel, label }) => {
	if (placeholder) return placeholder
	else if (hideLabel) return label
	else return ''
}
