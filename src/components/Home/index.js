import {Redirect, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <div>
      <Header />
      <h1>Find The Job That Fits Your Life</h1>
      <p>
        Millions of people are searching for jobs, salary information, company
        reviews. Find the job that fits your abilities and potential.
      </p>
      <Link to="/jobs">
        <button type="button">Find Jobs</button>
      </Link>
    </div>
  )
}

export default Home
