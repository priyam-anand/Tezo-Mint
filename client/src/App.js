import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css';
import Create from './components/Create/Create';
import Interact from './components/Interact/Interact';
import { init, getAccount, deploy, readMetaData, mint, transfer, approve, getBalance, getAllowance, burn } from './api';
import "./App.css";

const App = () => {

  const [side, setSide] = useState(1);
  const [initialized, setInitialized] = useState(false);

  const [account, setAccount] = useState({ account: { address: '' } });
  const [createdTokenAddress, setCreatedTokenAddress] = useState('');

  const _init = async () => {
    try {
      await init();
      const account = await getAccount();
      setAccount(account);
      setInitialized(true);
    } catch (error) {
      console.log(error);
      window.alert(error.message);
      window.location.reload();
    }
  }

  const _deploy = async (name, symbol, decimals) => {
    try {
      const addr = await deploy(name, symbol, decimals, account);
      setCreatedTokenAddress(addr);
    } catch (error) {
      console.log(error);
      window.alert(error.message);
    }
  }

  const _readMetaData = async (token_address) => {
    try {
      return await readMetaData(token_address);
    } catch (error) {
      console.log(error);
      window.alert(error.message);
    }
  }

  const _mint = async (_Mint, token_address) => {
    try {
      await mint(_Mint, token_address);
    } catch (error) {
      console.log(error);
      window.alert(error.message);
    }
  }

  const _transfer = async (_Transfer, token_address) => {
    try {
      await transfer(_Transfer, token_address)
    } catch (error) {
      console.log(error);
      window.alert(error.message);
    }
  }

  const _approve = async (_Approve, token_address) => {
    try {
      await approve(_Approve, token_address);
    } catch (error) {
      console.log(error);
      window.alert(error.message);
    }
  }

  const _getBalance = async (_address, token_address) => {
    try {
      return await getBalance(_address, token_address);
    } catch (error) {
      console.log(error);
      window.alert(error.message);
    }
  }

  const _getAllowance = async (_address, token_address) => {
    try {
      return await getAllowance(_address, token_address, account);
    } catch (error) {
      console.log(error);
      window.alert(error.message);
    }
  }

  const _burn = async (_Burn, token_address) => {
    try {
      await burn(_Burn, token_address);
    } catch (error) {
      console.log(error);
      window.alert(error.message);
    }
  }

  return (
    <>
      <Navbar side={side} setSide={setSide} _init={_init} initialized={initialized} account={account} />
      {
        createdTokenAddress != '' ? <div className='message-wrapper'>
          <span className='connection-message'>
            {`Your recenty created token : ${createdTokenAddress}`}
          </span>
        </div> : null
      }
      {initialized ? side == 1 ? <Create createdTokenAddress={createdTokenAddress} deploy={_deploy} /> : <Interact readMetaData={_readMetaData} _mint={_mint} _transfer={_transfer} _approve={_approve} getBalance={_getBalance} getAllowance={_getAllowance} _burn={_burn} /> : <div className='message-wrapper'>
        <span className='connection-message'>
          You need to connect your wallet to use the application
        </span>
      </div>

      }
    </>
  )
}

export default App