import {Component} from 'react'
import Loader from 'react-loader-spinner'

import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Write your code here
class GithubPopularRepos extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    reposPopularData: [],
    activeLanguageFilterId: languageFiltersData[0].id,
  }

  // call the api call in componentdidmount method
  componentDidMount() {
    this.getRepositoriesList()
  }

  getRepositoriesList = async () => {
    const {activeLanguageFilterId} = this.state

    // loader is displayed here

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeLanguageFilterId}`
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.popular_repos.map(eachItem => ({
        id: eachItem.id,
        imageUrl: eachItem.avatar_url,
        name: eachItem.name,
        starsCount: eachItem.stars_count,
        forksCount: eachItem.forks_count,
        issuesCount: eachItem.issues_count,
      }))
      this.setState({
        reposPopularData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderRepositoryList = () => {
    const {reposPopularData} = this.state
    return (
      <ul className="repository-list-container">
        {reposPopularData.map(eachItem => (
          <RepositoryItem key={eachItem.id} repositoryDetails={eachItem} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  renderLoaderview = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="green" height={50} width={50} />
    </div>
  )

  renderAllRepositories = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderRepositoryList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderview()
      default:
        return null
    }
  }

  // this setLanguageid is used to when we click on the button the list of items should be displayed
  setLanguageFilterId = updateId => {
    this.setState(
      {
        activeLanguageFilterId: updateId,
      },
      this.getRepositoriesList, // its displayed the corresponding list
    )
  }

  renderLanguageList = () => {
    const {activeLanguageFilterId} = this.state
    return (
      <ul className="unorder-list-header">
        {languageFiltersData.map(eachItem => (
          <LanguageFilterItem
            key={eachItem.id}
            languageDetails={eachItem}
            setLanguageFilterId={this.setLanguageFilterId} // update a list of data using id
            isActive={eachItem.id === activeLanguageFilterId} // when the id is matched the button should be highlighted
          />
        ))}
      </ul>
    )
  }

  render() {
    return (
      <div className="github-main-container">
        <div className="github-responsive-container">
          <h1 className="heading">Popular</h1>
          {this.renderLanguageList()}
          {this.renderAllRepositories()}
        </div>
      </div>
    )
  }
}

export default GithubPopularRepos
