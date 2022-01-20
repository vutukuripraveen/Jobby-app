import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {BsFillStarFill, BsSearch} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {Component} from 'react'
import './index.css'
import Header from '../Header'
import Profile from '../Profile'
import FilterGroup from '../FilterGroup'

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

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobsRoute extends Component {
  state = {
    activeEmploymentId: [],
    activeSalaryRangeId: '',
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    jobsData: [],
  }

  componentDidMount() {
    this.getJobsData()
  }

  getJobsData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {activeEmploymentId, activeSalaryRangeId, searchInput} = this.state
    const activeEmploymentsIds = activeEmploymentId.join()
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentsIds}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onSearchButton = () => {
    this.getJobsData()
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  changePackage = activeSalaryRangeId => {
    this.setState({activeSalaryRangeId}, this.getJobsData)
  }

  changeEmployment = id => {
    this.setState(
      prevState => ({
        activeEmploymentId: [...prevState.activeEmploymentId, id],
      }),
      this.getJobsData,
    )
  }

  renderJobsListView = () => {
    const {jobsData} = this.state
    const shouldShowJobsList = jobsData.length > 0
    return shouldShowJobsList ? (
      <ul className="jobs-list-container">
        {jobsData.map(eachJob => (
          <Link to={`/jobs/${eachJob.id}`} className="job-item-link">
            <li className="job-item-container">
              <div className="logo-title-star-container">
                <img
                  src={eachJob.companyLogoUrl}
                  alt="company logo"
                  className="company-logo"
                />
                <div>
                  <h1 className="title">{eachJob.title}</h1>
                  <div className="star-container">
                    <BsFillStarFill className="fill-star icon" />
                    <p>{eachJob.rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-job-type-salary-container">
                <div className="location-job-type-container">
                  <div className="location-container">
                    <MdLocationOn className="icon" />
                    <p>{eachJob.location}</p>
                  </div>
                  <div className="location-container">
                    <MdLocationOn className="icon" />
                    <p>{eachJob.employmentType}</p>
                  </div>
                </div>
                <p>{eachJob.packagePerAnnum}</p>
              </div>
              <hr />
              <h1 className="description">Description</h1>
              <p>{eachJob.jobDescription}</p>
            </li>
          </Link>
        ))}
      </ul>
    ) : (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-jobs-image"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
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
      <button type="button" className="button" onClick={this.getJobsData}>
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div testid="loader" className="jobs-loader-container">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

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

  render() {
    const {searchInput} = this.state
    return (
      <div className="jobs-page-container">
        <Header />
        <div className="jobs-page">
          <div className="profile-filter-options-section">
            <Profile />
            <hr className="line" />
            <FilterGroup
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
              changeEmployment={this.changeEmployment}
              changePackage={this.changePackage}
            />
          </div>
          <div className="jobs-content-container">
            <div className="search-input-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                value={searchInput}
                onChange={this.changeSearchInput}
              />
              <button
                type="button"
                testid="searchButton"
                className="search-button"
                onClick={this.onSearchButton}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderAllJobs()}
          </div>
        </div>
      </div>
    )
  }
}

export default JobsRoute
