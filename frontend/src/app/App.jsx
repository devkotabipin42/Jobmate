import {  useLocation } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppRoutes from './app.routes.jsx'
import { useEffect } from 'react'


const ScrollToTop = () => {
    const { pathname } = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])
    return null
}
function App() {
  const { isDark } = useSelector(state => state.theme)

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className='min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300'>
        <BrowserRouter>
        <ScrollToTop/>
          <AppRoutes />
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App