import React, { useState } from 'react'
import "./Interact.css";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Modal } from 'react-bootstrap';

const Interact = ({ readMetaData, _mint, _transfer, _approve, getBalance, getAllowance, _burn }) => {

    const [age, setAge] = React.useState('');
    const [mint, setMint] = useState({
        amount: '',
        to: ''
    });
    const [transfer, setTransfer] = useState({ from: '', to: '', amount: '' });
    const [approve, setApprove] = useState({ amount: '', to: '' });
    const [balance, setBalance] = useState({
        amount: '',
        address: ''
    });
    const [allowance, setAllowance] = useState({
        amount: '',
        address: ''
    });
    const [burn, setBurn] = useState({
        from: '',
        amount: ''
    })
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tokenContract, setTokenContract] = useState('');
    const [confirmTokenContract, setConfirmTokenContract] = useState('');
    const [contractLoading, setContractLoading] = useState(false);
    const [tokenDetails, setTokenDetails] = useState({
        name: '',
        symbol: '',
        decimals: ''
    })


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleChange = (event) => {
        setAge(event.target.value);
    };

    const handleTokenSelect = async () => {
        setContractLoading(true);
        const metadata = await readMetaData(tokenContract);
        console.log(metadata)
        setConfirmTokenContract(tokenContract);
        setTokenDetails(metadata);
        setContractLoading(false);
    }

    const handleInteract = async () => {
        setLoading(true);
        handleShow();
        try {
            if (age == 1) {
                await _mint(mint, confirmTokenContract);
                setLoading(false);
            }

            if (age == 2) {
                await _transfer(transfer, confirmTokenContract);
                setLoading(false);
            }

            if (age == 3) {
                await _approve(approve, confirmTokenContract);
                setLoading(false);
            }

            if (age == 4) {
                const _amount = await getBalance(balance.address, confirmTokenContract);
                setBalance({ ...balance, amount: _amount });
                setLoading(false);
            }

            if (age == 5) {
                const _amount = await getAllowance(allowance.address, confirmTokenContract);
                setAllowance({ ...allowance, amount: _amount });
                setLoading(false);
            }

            if (age == 6) {
                await _burn(burn, confirmTokenContract);
                setLoading(false);
            }
        } catch (err) {
            window.alert(err);
            window.location.reload();
        }
    }

    return (
        <main className='main-wrapper'>
            <div className="swap-header">
                <div className="swap-row">
                    Load any FA1.2 standart token and interact with it !
                </div>
            </div>
            <div className="swap-body-outer-wrapper">
                <div className="swap-body-inner-wrapper">
                    <div>
                        <div className="swap-header">
                            <div className="input-label">
                                Load Contract
                            </div>
                        </div>
                        <div className="swap-input-wrapper">
                            <div className="swap-input">
                                <div className="swap-input-panel">
                                    <input type="text" placeholder='Token Address' value={tokenContract} onChange={e => setTokenContract(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <button className="swap-btn" onClick={handleTokenSelect}>
                            {
                                !contractLoading ? "Load Contract" : <div className="spinner-border" role="status">
                                    <span className="sr-only"></span>
                                </div>
                            }

                        </button>

                        {
                            tokenDetails.name == '' ? <></> : <><div className="swap-header">
                                <div className="input-label">
                                    Choose an action
                                </div>
                            </div>

                                <div className="swap-header color-white">
                                    <FormControl fullWidth sx={{
                                        m: 1,
                                        width: 300,
                                        height: 25,
                                        color: 'white'
                                    }}>
                                        <InputLabel id="demo-simple-select-label">Operation</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={age}
                                            label="Age"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={1}>Mint</MenuItem>
                                            <MenuItem value={2}>Transfer</MenuItem>
                                            <MenuItem value={3}>Approve</MenuItem>
                                            <MenuItem value={4}>Get Balance</MenuItem>
                                            <MenuItem value={5}>Get Allowance</MenuItem>
                                            <MenuItem value={6}>Burn</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className="swap-header mb-3">
                                    <div className="input-label">
                                        <span className='mx-2'>
                                            {`Name : ${tokenDetails.name}`}
                                        </span>
                                        <span className='mx-1'>
                                            {`Symbol : ${tokenDetails.symbol}`}
                                        </span>
                                        <span className='mx-2'>
                                            {`Decimals : ${tokenDetails.decimals}`}
                                        </span>

                                    </div>
                                </div>
                            </>
                        }

                        {
                            age == 1 ? <><div className="swap-header mt-5">
                                <div className="input-label">
                                    Mint
                                </div>
                            </div>
                                <div className="swap-input-wrapper">
                                    <div className="swap-input">
                                        <div className="swap-input-panel">
                                            <input type="number" value={mint.amount} placeholder='Amount' onChange={e => setMint({ ...mint, amount: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="swap-input-wrapper">
                                    <div className="swap-input">
                                        <div className="swap-input-panel">
                                            <input type="text" value={mint.to} placeholder='To' onChange={e => setMint({ ...mint, to: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </> : null
                        }
                        {
                            age == 2 ? <>
                                <div className="swap-header">
                                    <div className="input-label">
                                        Transfer
                                    </div>
                                </div>
                                <div className="swap-input-wrapper">
                                    <div className="swap-input">
                                        <div className="swap-input-panel">
                                            <input type="text" value={transfer.from} placeholder='From' onChange={e => setTransfer({ ...transfer, from: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="swap-input-wrapper">
                                    <div className="swap-input">
                                        <div className="swap-input-panel">
                                            <input type="text" value={transfer.to} placeholder='To' onChange={e => setTransfer({ ...transfer, to: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="swap-input-wrapper">
                                    <div className="swap-input">
                                        <div className="swap-input-panel">
                                            <input type="text" value={transfer.amount} placeholder='Amount' onChange={e => setTransfer({ ...transfer, amount: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </> : null
                        }

                        {
                            age == 3 ? <>
                                <div className="swap-header">
                                    <div className="input-label">
                                        Approve
                                    </div>
                                </div>
                                <div className="swap-input-wrapper">
                                    <div className="swap-input">
                                        <div className="swap-input-panel">
                                            <input type="text" value={approve.to} placeholder='To' onChange={e => setApprove({ ...approve, to: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="swap-input-wrapper">
                                    <div className="swap-input">
                                        <div className="swap-input-panel">
                                            <input type="text" value={approve.amount} placeholder='Amount' onChange={e => setApprove({ ...approve, amount: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </> : null
                        }

                        {
                            age == 4 ? <><div className="swap-header">
                                <div className="input-label">
                                    Get Balance
                                </div>
                            </div>
                                <div className="swap-input-wrapper">
                                    <div className="swap-input">
                                        <div className="swap-input-panel">
                                            <input type="text" value={balance.address} placeholder="Address" onChange={e => setBalance({ ...balance, address: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <span className='display-span'>
                                    {balance.amount != ''
                                        ? "Balance = " + balance.amount
                                        : ''
                                    }
                                </span>
                            </> : null
                        }

                        {
                            age == 5 ? <>
                                <div className="swap-header">
                                    <div className="input-label">
                                        Get Allowance
                                    </div>
                                </div>
                                <div className="swap-input-wrapper">
                                    <div className="swap-input">
                                        <div className="swap-input-panel">
                                            <input type="text" value={allowance.address} placeholder="Address" onChange={e => setAllowance({ ...allowance, address: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <span className='display-span'>
                                    {allowance.amount != ''
                                        ? "Allowance = " + allowance.amount
                                        : ''
                                    }
                                </span>
                            </> : null
                        }

                        {
                            age == 6 ? <>
                                <div className="swap-header">
                                    <div className="input-label">
                                        Burn
                                    </div>
                                </div>
                                <div className="swap-input-wrapper">
                                    <div className="swap-input">
                                        <div className="swap-input-panel">
                                            <input type="text" value={burn.from} placeholder="From" onChange={e => setBurn({ ...burn, from: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="swap-input-wrapper">
                                    <div className="swap-input">
                                        <div className="swap-input-panel">
                                            <input type="number" value={burn.amount} placeholder="Amount" onChange={e => setBurn({ ...burn, amount: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            </> : null
                        }
                        {
                            tokenDetails.name == '' ? null : <button className="swap-btn" onClick={handleInteract}>
                                Interact
                            </button>
                        }

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
                                Your transaction is processing
                            </span>
                                <div className="spinner-border text-primary mt-5 p-3" role="status">
                                    <span className="sr-only"></span>
                                </div>
                            </> : <><span className="modal-heading">
                                Your transaction has been processed successfully
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

export default Interact