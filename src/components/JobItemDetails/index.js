import React, {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar} from 'react-icons/fa'
import {withRouter} from 'react-router-dom'
import Header from '../Header'

class JobItemDetails extends Component {
  state = {
    jobDetails: null,
    similarJobs: [],
    skills: [],
    lifeAtCompany: {},
    isLoading: true,
    error: null,
  }

  componentDidMount() {
    this.initializeFetch()
  }

  initializeFetch = async () => {
    this.setState({isLoading: true})
    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const fetchedJobDetails = {
        id: fetchedData.job_details.id,
        title: fetchedData.job_details.title,
        companyLogoUrl: fetchedData.job_details.company_logo_url,
        employmentType: fetchedData.job_details.employment_type,
        location: fetchedData.job_details.location,
        rating: fetchedData.job_details.rating,
        skills: fetchedData.job_details.skills,
        lifeAtCompany: fetchedData.job_details.life_at_company,
        companyWebsiteURL: fetchedData.job_details.company_website_url,
        packagePerAnnum: fetchedData.job_details.package_per_annum,
        description: fetchedData.job_details.job_description,
      }

      const fetchedSimilarJobsDetails = fetchedData.similar_jobs.map(job => ({
        id: job.id,
        title: job.title,
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        location: job.location,
        rating: job.rating,
        description: job.job_description,
      }))

      const fetchedSkills = fetchedData.job_details.skills.map(skill => ({
        imageURL: skill.image_url,
        name: skill.name,
      }))

      const fetchedLifeAtCompany = {
        description: fetchedData.job_details.life_at_company.description,
        imageUrl: fetchedData.job_details.life_at_company.image_url,
      }

      this.setState({
        skills: fetchedSkills,
        jobDetails: fetchedJobDetails,
        similarJobs: fetchedSimilarJobsDetails,
        lifeAtCompany: fetchedLifeAtCompany,
        isLoading: false,
      })
    } else {
      this.setState({error: true, isLoading: false})
    }
  }

  handleRetry = () => {
    this.initializeFetch()
  }

  render() {
    const {jobDetails, similarJobs, skills, lifeAtCompany, isLoading, error} =
      this.state

    if (isLoading) {
      return (
        <div data-testid="loader" className="jobs-loader-container">
          <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
        </div>
      )
    }

    if (error) {
      return (
        <div>
          <Header />
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
              alt="failure view"
            />
            <h1>Oops! Something went wrong</h1>
            <p>We cannot seem to find the page you are looking for</p>
            <button onClick={this.handleRetry}>retry</button>
          </div>
        </div>
      )
    }

    return (
      <div>
        <Header />
        <h1>JOB ITEM DETAILS</h1>
        {jobDetails && (
          <div>
            <img
              src={jobDetails.companyLogoUrl}
              alt="job details company logo"
              style={{width: '100px', height: '100px'}}
            />
            <a href={jobDetails.companyWebsiteURL}>Visit</a>
            <h2>{jobDetails.title}</h2>
            <h2>Description</h2>
            <p>{jobDetails.description}</p>
            <h3>Skills:</h3>
            <ul>
              {skills.map(skill => (
                <li key={skill.name}>
                  <img
                    src={skill.imageURL}
                    alt={skill.name}
                    style={{width: '30px', height: '30px'}}
                  />
                  {skill.name}
                </li>
              ))}
            </ul>
            <div>
              <h2>Life At Company</h2>
              <p>{lifeAtCompany.description}</p>
              <img src={lifeAtCompany.imageUrl} alt="life at company" />
            </div>
            <ul>
              <li>
                <p>
                  <strong>Location:</strong> {jobDetails.location}
                </p>
              </li>
              <li>
                <p>
                  <strong>Employment Type:</strong> {jobDetails.employmentType}
                </p>
              </li>
              <li>
                <p>
                  <strong>Package:</strong> {jobDetails.packagePerAnnum}
                </p>
              </li>
              <li>
                <p>
                  <FaStar /> {jobDetails.rating}
                </p>
              </li>
            </ul>
          </div>
        )}

        <h2>Similar Jobs</h2>
        <ul>
          {similarJobs.map(job => (
            <li key={job.id}>
              <img
                src={job.companyLogoUrl}
                alt="similar job company logo"
                style={{width: '50px', height: '50px'}}
              />
              <h3>{job.title}</h3>
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Employment Type:</strong> {job.employmentType}
              </p>
              <p>
                <strong>Rating:</strong> {job.rating}
              </p>
              <h2>Description</h2>
              <p>{job.description}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default withRouter(JobItemDetails)
