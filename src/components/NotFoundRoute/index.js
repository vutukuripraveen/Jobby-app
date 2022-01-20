import './index.css'
import Header from '../Header'

const NotFoundRoute = () => (
  <div className="not-found-container">
    <Header />
    <div className="not-found-content-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        alt="not found"
      />
      <h1 className="description">Page Not Found</h1>
      <p className="paragraph">
        we’re sorry, the page you requested could not be found
      </p>
    </div>
  </div>
)

export default NotFoundRoute
