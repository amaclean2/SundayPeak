import cx from 'classnames'

export * from './ConfirmationPage'
export * from './DisplayCard'
export * from './DisplayCard/ProfileHeader'
export * from './DisplayCard/ProfileContent'
export * from './DisplayCard/FooterButtons'
export * from './ErrorField'
export * from './FormField'
export * from './FormField/MultiField'
export * from './Button'
export * from './FieldOrganizer'
export * from './ImageViewer'
export * from './Accordion'
export * from './ConfirmationPage'
export * from './MobileMenu'

export const FlexSpacer = ({ size = 'one' }) => <div className={cx('flex-spacer', size)} />
export const Degrees = () => <span>&#176;</span>
