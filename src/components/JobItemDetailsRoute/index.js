import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsFillStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {Component} from 'react'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetailsRoute extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobItemData: [],
    similarJobsData: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getFormattedSimilarJobData = job => ({
    companyLogoUrl: job.company_logo_url,
    employmentType: job.employment_type,
    id: job.id,
    jobDescription: job.job_description,
    location: job.location,
    rating: job.rating,
    title: job.title,
  })

  getFormattedSkillData = skill => ({
    imageUrl: skill.image_url,
    name: skill.name,
  })

  getFormattedLifeCompanyData = life => ({
    description: life.description,
    imageUrl: life.image_url,
  })

  getFormattedData = job => ({
    companyLogoUrl: job.company_logo_url,
    companyWebsiteUrl: job.company_website_url,
    employmentType: job.employment_type,
    id: job.id,
    jobDescription: job.job_description,
    location: job.location,
    packagePerAnnum: job.package_per_annum,
    rating: job.rating,
    title: job.title,
    skills: job.skills.map(eachSkill => this.getFormattedSkillData(eachSkill)),
    lifeAtCompany: this.getFormattedLifeCompanyData(job.life_at_company),
  })

  getJobItemDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData.job_details)
      const updatedSimilarJobsData = fetchedData.similar_jobs.map(
        eachSimilarJob => this.getFormattedSimilarJobData(eachSimilarJob),
      )
      this.setState({
        jobItemData: updatedData,
        apiStatus: apiStatusConstants.success,
        similarJobsData: updatedSimilarJobsData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobItemDetailsView = () => {
    const {jobItemData, similarJobsData} = this.state
    const {
      companyLogoUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = jobItemData
    return (
      <div>
        <div className="job-item-details-container">
          <div className="logo-title-star-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div>
              <h1 className="title">{title}</h1>
              <div className="star-container">
                <BsFillStarFill className="fill-star icon" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="location-job-type-salary-container">
            <div className="location-job-type-container">
              <div className="location-container">
                <MdLocationOn className="icon" />
                <p>{location}</p>
              </div>
              <div className="location-container">
                <MdLocationOn className="icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <div className="description-url">
            <h1 className="description">Description</h1>
            <a href={companyWebsiteUrl}>Visit</a>
          </div>
          <p>{jobDescription}</p>
          <h1 className="description">Skills</h1>
          <ul className="skills-container">
            {skills.map(eachSkill => (
              <li className="skill-item">
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="skill-image"
                />
                <p>{eachSkill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="description">Life at Company</h1>
          <div className="life-at-company-container">
            <p>{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
        <h1 className="similar-jobs-title">Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobsData.map(eachSimilarJob => (
            <SimilarJobs
              similarJobDetails={eachSimilarJob}
              key={eachSimilarJob.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-jobs-image"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="button" onClick={this.getJobItemDetails}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div testid="loader" className="jobs-loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-item-details-page">
        <Header />
        {this.renderJobItemDetails()}
      </div>
    )
  }
}
export default JobItemDetailsRoute
