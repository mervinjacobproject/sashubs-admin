import React, { useEffect } from 'react'
import EmployeeDetails from 'src/pages/apps/employee/employee-details'

const Index = () => {

  useEffect(() => {
    document.title = 'Overdue reports 5aab';
    return () => {
      document.title = '5aab';
    };
  }, []);

  return (
    <div>
      <EmployeeDetails/>
    </div>
  )
}

export default Index
