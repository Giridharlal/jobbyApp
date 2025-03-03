import {useHistory} from 'react-router-dom'
import Header from '../Header'

const NotFound = () => {
  const history = useHistory()
  const retry = () => {
    history.replace('./jobs')
  }
  return (
    <div>
      <Header />
      <img
        src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
        alt="not found"
      />
      <h1>Page Not Found</h1>
      <p>We are sorry, the page you requested could not be found</p>
      <button onClick={retry}>Retry</button>
    </div>
  )
}

export default NotFound
