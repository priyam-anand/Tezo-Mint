import React, { useState } from 'react'
import "./Navbar.css";

const Navbar = ({ side, setSide }) => {

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
            {/* <div className='navbar-right-wrapper'>
                <div className="navbar-tab-3">
                    <div className="navbar-bal">
                        0 ETH
                    </div>
                    <div className="navbar-account">
                        0x2860...127e
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default Navbar