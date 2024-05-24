import React from 'react'
import { Outlet } from 'react-router-dom'

const LoginTemplate = () => {
  return (
    <div>
        <div className="row login-template">
            <div className="col-6 d-none d-md-block img-wrap">
                <img className="login-img img-fluid w-100" src="https://st4.depositphotos.com/16959514/27403/v/450/depositphotos_274031174-stock-illustration-kanban-board-teamwork-briefing-scheme.jpg" alt="..." />
            </div>
            <div className="col-12 col-md-6 outlet">
                <Outlet/>
            </div>
        </div>
    </div>
  )
}

export default LoginTemplate