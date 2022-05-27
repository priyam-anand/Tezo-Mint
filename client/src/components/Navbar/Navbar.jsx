import React, { useEffect, useState } from 'react'
import "./Navbar.css";
import { getAccountBalance } from "../../api"

const Navbar = ({ side, setSide, _init, initialized, account }) => {

    return (
        <div className='navbar-wrapper'>
            <div className="navbar-tab-1">
                <div className={`pill ${side == 1 ? 'nav-active' : ""}`} onClick={e => setSide(1)}>
                    Create
                </div>
                <div className={`pill ${side == 2 ? 'nav-active' : ""}`} onClick={e => setSide(2)}>
                    Interact
                </div>
            </div>

            <div className='navbar-right-wrapper'>
                <div className="navbar-tab-3">
                    <div className="navbar-account">
                        {account.account.address}
                    </div>
                </div>
                {
                    !initialized ? <div className="navbar-tab-3">
                        <button className="navbar-account btn" onClick={_init}>
                            Connect Wallet
                        </button>
                    </div> : null
                }
            </div>
        </div>
    )
}

export default Navbar