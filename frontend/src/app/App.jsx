import { BrowserRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppRoutes from './app.routes.jsx'

function App() {
  const { isDark } = useSelector(state => state.theme)

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300'>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App