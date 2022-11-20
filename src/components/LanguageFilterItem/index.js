// Write your code here
import './index.css'

const LanguageFilterItem = props => {
  const {isActive, languageDetails, setLanguageFilterId} = props
  const {id, language} = languageDetails
  const btnClassName = isActive ? 'language-btn active-btn' : 'language-btn' // is Active is highlighted the button

  // onClick tab btn is used to navigate to one button to another
  const onClickTab = () => {
    setLanguageFilterId(id)
  }

  return (
    <li>
      <button type="button" onClick={onClickTab} className={btnClassName}>
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
