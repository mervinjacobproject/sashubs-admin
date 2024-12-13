import React from 'react'
// import EmployeeAccount from './employeeAccount'
import AdminLogin from './adminAccount'

const TabAccount = () => {
  const loginType = localStorage.getItem('adminLoginType')

  return (
    <div>
      {
        loginType === '1' && <AdminLogin />
        //  : <EmployeeAccount />
      }
    </div>
  )
}

export default TabAccount
