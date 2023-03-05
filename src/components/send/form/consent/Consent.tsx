import './Consent.scss'

export const Consent = (): JSX.Element => {
  return (
    <div className='consent-container'>
      <input type="checkbox" name="toto" id="consentCheckbox" />
      <label htmlFor="consentCheckbox">{'J\'accepte que cette photo soit intégrée à un jeu de données public'}</label>
    </div>
  )
}
