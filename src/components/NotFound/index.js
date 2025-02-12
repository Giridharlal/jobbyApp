import {useHistory} from 'react-router-dom'

const NotFound = () => {
  const history = useHistory()
  const retry = () => {
    history.replace('./')
  }
  return (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! something Went Wrong</h1>
      <p>We cannot seem to find the page your looking for</p>
      <button onClick={retry}>Retry</button>
    </div>
  )
}

export default NotFound
