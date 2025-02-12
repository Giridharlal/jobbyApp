import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

class Jobs extends Component {
  state = {
    jobList: [],
    apiStatus: apiStatusConstants.initial,
    profileDetails: [],
    selectedEmploymentTypesList: [],
    selectedSalaryRange: 1000000,
    searchInput: '',
  }

  componentDidMount() {
    this.getJobs()
    this.getProfileDetails()
  }

  handleEmploymentTypeChange = event => {
    const {value} = event.target
    this.setState(prevState => {
      const {selectedEmploymentTypesList} = prevState
      if (selectedEmploymentTypesList.includes(value)) {
        return {
          selectedEmploymentTypesList: selectedEmploymentTypesList.filter(
            type => type !== value,
          ),
        }
      }
      return {
        selectedEmploymentTypesList: [...selectedEmploymentTypesList, value],
      }
    }, this.getJobs)
  }

  handleSalaryRangesChange = event => {
    const {value} = event.target
    const salaryPackage = parseInt(value.slice(0, 2)) * 100000
    this.setState({selectedSalaryRange: salaryPackage}, this.getJobs)
  }

  handleSearchInputChange = event => {
    const value = event.target.value
    this.setState({searchInput: value})
  }

  handleSearch = () => {
    this.getJobs()
  }

  handleKeyPress = event => {
    if (event.key === 'Enter') {
      this.handleSearch()
    }
  }

  getJobs = async () => {
    const {selectedEmploymentTypesList, selectedSalaryRange, searchInput} =
      this.state
    const employmentType = selectedEmploymentTypesList
      .map(type => type.toUpperCase())
      .join(',')
    console.log('EMPLOYMENT TYPE', employmentType)
    console.log(typeof employmentType)
    console.log('selectedSalaryRangesList', selectedSalaryRange)
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${selectedSalaryRange}&search=${searchInput}`
    console.log(apiUrl)

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log('FETCHED DATA', fetchedData)
      const updatedJobList = fetchedData.jobs.map(job => ({
        id: job.id,
        title: job.title,
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        description: job.job_description,
      }))
      this.setState({
        jobList: updatedJobList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
    console.log(this.state.apiStatus)
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedProfileDetails = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      this.setState({profileDetails: updatedProfileDetails})
    }
  }

  renderFailureView = () => (
    <div className="jobs-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="jobs-failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  renderLoadingView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderJobsListView = () => {
    const {jobList, searchInput} = this.state

    return (
      <div>
        <input
          type="search"
          value={searchInput}
          onChange={this.handleSearchInputChange}
          placeholder="search for jobs"
          className="search-input"
          onKeyPress={this.handleKeyPress}
        />
        <button
          type="button"
          onClick={this.handleSearch}
          data-testid="searchButton"
        >
          <BsSearch className="search-icon" />
        </button>
        <div>
          {jobList.length !== 0 ? (
            <ul className="jobs-list">
              {jobList.map(job => (
                <li key={job.id} className="job-item">
                  <Link to={`/jobs/${job.id}`}>
                    <img
                      src={job.companyLogoUrl}
                      alt="company logo"
                      className="company-logo"
                    />
                    <div>
                      <h2 className="job-title">{job.title}</h2>
                      <p className="job-location">{job.location}</p>
                      <p className="job-employment-type">
                        {job.employmentType}
                      </p>
                      <p className="job-package">{job.packagePerAnnum}</p>
                      <h2>Description</h2>
                      <p>{job.description}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div>
              <img
                src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                alt="no jobs"
              />
              <h1>No Jobs Found</h1>
              <p>We could not find any jobs. Try other filters</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderEmpolymentType = () => (
    <div>
      <ul>
        {employmentTypesList.map(employment => (
          <li
            key={employment.employmentTypeId}
            className="employment-type-item"
          >
            <label htmlFor={employment.employmentTypeId}>
              <input
                type="checkbox"
                id={employment.employmentTypeId}
                value={employment.employmentTypeId}
                onChange={this.handleEmploymentTypeChange}
              />
              {employment.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderSalaryRanges = () => {
    const {selectedSalaryRange} = this.state
    return (
      <div>
        <h1>Salary Range</h1>
        <ul>
          {salaryRangesList.map(salary => (
            <li key={salary.salaryRangeId} className="salary-type-item">
              <label htmlFor={salary.salaryRangeId}>
                <input
                  type="radio"
                  id={salary.salaryRangeId}
                  value={salary.label}
                  checked={
                    parseInt(selectedSalaryRange) ===
                    parseInt(salary.salaryRangeId)
                  }
                  onChange={this.handleSalaryRangesChange}
                />
                {salary.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  render() {
    const {profileDetails} = this.state
    return (
      <div className="jobs-container">
        <Header />
        <div>
          {profileDetails.length === 0 ? (
            <button onClick={this.getProfileDetails}>Retry</button>
          ) : (
            <div>
              <img src={profileDetails.profileImageUrl} alt="profile" />
              <h1>{profileDetails.name}</h1>
              <p>{profileDetails.shortBio}</p>
            </div>
          )}
          <div>
            <h1>Type of Employment</h1>
            {this.renderEmpolymentType()}
            {this.renderSalaryRanges()}
          </div>
        </div>
        {this.renderAllJobs()}
      </div>
    )
  }
}

export default Jobs
