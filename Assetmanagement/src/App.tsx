
import './App.css'
import Login from './layout/Login'
import Sidebar from './layout/Sidebar'
import Topbar from './layout/Topbar'
import Dashboard from './components/Dashboard'
import Rolemaster from './components/Rolemaster'
import Usermaster from './components/Usermaster'
import Category from './components/Category'
import { useState, useEffect } from 'react'
import Areamaster from './components/Areamaster'
import Uommaster from './components/Uommaster'
import Assetmaster from './components/Assetmaster'
import Vendormaster from './components/Vendormaster'
import GRN from './components/GRN'
import Assettype from './components/Assettype'
import Vendortype from './components/Vendortype'
import RFIDbinding from './components/RFIDbinding'
import Assetallocation from './components/Assetallocation'
import Assetallocationreport from './components/Assetallocationreport'
import Rfidbindingreport from './components/Rfidbindingreport'
import Deploymentreport from './components/Deploymentreport'
import Reconciliation from './components/Reconciliation'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) setLoggedIn(true)
  }, [])

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'rolemaster':
        return <Rolemaster />
      case 'category':
        return <Category />
      case 'usermaster':
        return <Usermaster />
      case 'areamaster':
        return <Areamaster />
      case 'unitofmeasurement':
        return <Uommaster />
      case 'assettype':
        return <Assettype />
      case 'asset':
        return <Assetmaster />
      case 'vendortype':
        return <Vendortype />
      case 'vendormaster':
        return <Vendormaster />
      case 'grn':
        return <GRN />
      case 'rfidbinding':
        return <RFIDbinding />
      case 'assetallocation':
        return <Assetallocation />
      case 'allocationreport':
        return <Assetallocationreport />
      case 'rfidbindingreport':
        return <Rfidbindingreport />
      case 'deploymentreport':
        return <Deploymentreport />
      case 'reconciliation':
        return <Reconciliation />
      
    }
  }

  const handleLogout = () => {
    setLoggedIn(false)
    setCurrentPage('dashboard')
  }

  return (
    <>
      {loggedIn ? (
        <>
          <Topbar onLogout={handleLogout} />
          <div style={{ display: 'flex', marginTop: 90 }}>
            <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
            <main style={{ marginLeft: 280, padding: 24, flex: 1, backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 90px)' }}>
              {renderPage()}
            </main>
          </div>
        </>
      ) : (
        <Login onLogin={() => setLoggedIn(true)} />
      )}
    </>
  )
}

export default App
