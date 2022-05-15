import React, { useState } from 'react'
import "./Create.css";
import { Modal } from 'react-bootstrap';

const Create = ({ createdTokenAddress, deploy }) => {
    const [name, setName] = useState('')
    const [symbol, setSymbol] = useState('')
    const [decimals, setDecimals] = useState('')
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDeploy = async () => {
        handleShow();
        setLoading(true);
        await deploy(name, symbol, decimals);
        setLoading(false);
    }

    return (
        <main className='main-wrapper'>
            <div className="swap-header">
                <div className="swap-row">
                    Create a new fungible asset token
                </div>
            </div>
            <div className="swap-body-outer-wrapper">
                <div className="swap-body-inner-wrapper">
                    <div>
                        <div className="swap-input-wrapper">
                            <div className="swap-input">
                                <div className="swap-input-panel">
                                    <input type="text" placeholder='Name of token' value={name} onChange={e => setName(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="swap-input-wrapper">
                            <div className="swap-input">
                                <div className="swap-input-panel">
                                    <input type="text" placeholder='Symbol of token' value={symbol} onChange={e => setSymbol(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <div className="swap-input-wrapper">
                            <div className="swap-input">
                                <div className="swap-input-panel">
                                    <input type="number" placeholder='Number of decimals' value={decimals} onChange={e => setDecimals(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <button className="swap-btn" onClick={e => handleDeploy()}>
                            Deploy
                        </button>

                    </div>
                </div>
            </div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
                aria-labelledby="contained-modal-title-vcenter"
            >
                <Modal.Body>
                    <div className="modal-body">
                        {
                            loading ? <><span className="modal-heading">
                                Your contract is being deployed
                            </span>
                                <div className="spinner-border text-primary mt-5 p-3" role="status">
                                    <span className="sr-only"></span>
                                </div>
                            </> : <><span className="modal-heading">
                                Your contract has been deployed at
                            </span>
                                <span className="address">
                                    {createdTokenAddress}
                                </span>
                            </>
                        }
                    </div>
                </Modal.Body>

                <button className='token-modal-close' disabled={loading} onClick={handleClose}>
                    Close
                </button>
            </Modal>
        </main>
    )
}

export default Create