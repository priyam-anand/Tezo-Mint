import React, { useEffect, useState } from 'react'
import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
import { TempleWallet } from '@temple-wallet/dapp';
import Contract from "./fungibleContractAsset.json";
import Navbar from './components/Navbar/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css';
import Create from './components/Create/Create';
import Interact from './components/Interact/Interact';

const App = () => {

  const [side, setSide] = useState(1);

  const [Tezos, setTezos] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [createdTokenAddress, setCreatedTokenAddress] = useState('');

  const [readTokenAddress, setReadTokenAddress] = useState('');

  const init = async () => {
    const _Tezos = new TezosToolkit('https://ithacanet.ecadinfra.com');
    TempleWallet.isAvailable()
      .then(() => {
        const mywallet = new TempleWallet('Tezo-Mint');
        mywallet
          .connect('ithacanet')
          .then(() => {
            _Tezos.setWalletProvider(mywallet);
            return mywallet.getPKH();
          })
          .then((pkh) => {
            console.log(`Your address: ${pkh}`);
            setAccount(pkh);
          });
      })
      .catch((err) => {
        window.alert(err)
        window.location.reload();
      });
    setTezos(_Tezos);
  }

  useEffect(() => {
    init();
  }, [])

  function ascii_to_hexa(str) {
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n++) {
      var hex = Number(str.charCodeAt(n)).toString(16);
      arr1.push(hex);
    }
    return arr1.join('');
  }

  function hex_to_ascii(str1) {
    var hex = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }

  const deploy = async (name, symbol, decimals) => {
    const tokenDetails = new MichelsonMap();
    tokenDetails.set('decimals', ascii_to_hexa(decimals));
    tokenDetails.set('name', ascii_to_hexa(name));
    tokenDetails.set('symbol', ascii_to_hexa(symbol));

    const tokenMetaData = new MichelsonMap();
    tokenMetaData.set(0, {
      token_id: 0,
      token_info: tokenDetails
    });
    try {
      const contractInstance = await Tezos.wallet.originate({
        code: Contract,
        storage: {
          administrator: account,
          balances: new MichelsonMap(),
          metadata: new MichelsonMap(),
          paused: false,
          token_metadata: tokenMetaData,
          totalSupply: 0
        }
      }).send();
      const contract = await contractInstance.contract();
      setCreatedTokenAddress(contract.address);
    } catch (error) {
      window.alert(`Error: ${JSON.stringify(error, null, 2)}`);
      window.location.reload();
    }
  }

  const readMetaData = async (token_address) => {
    try {
      const contractIni = await Tezos.wallet.at(token_address);
      const storage = await contractIni.storage();
      const metadata = (await storage.token_metadata.get('')).token_info;
      const name = hex_to_ascii(await metadata.get('name'));
      const symbol = hex_to_ascii(await metadata.get('symbol'));
      const decimals = hex_to_ascii(await metadata.get('decimals'));
      return {
        name: name,
        symbol: symbol,
        decimals: decimals
      }
    } catch (err) {
      window.alert(err);
      window.location.reload();
    }
  }

  const mint = async (_mint, token_address) => {
    try {
      const hash = await Tezos.wallet
        .at(token_address)
        .then((contract) => contract.methods.mint(_mint.to, _mint.amount).send())
        .then((op) => op.confirmation(1).then(() => op.opHash));
      console.log("hash", hash);
    } catch (err) {
      window.alert(err);
      window.location.reload();
    }
  }

  const transfer = async (_transfer, token_address) => {
    try {
      const hash = await Tezos.wallet
        .at(token_address)
        .then((contract) => contract.methods.transfer(_transfer.from, _transfer.to, _transfer.amount).send())
        .then((op) => op.confirmation(1).then(() => op.opHash));
      console.log("hash", hash);
    } catch (err) {
      window.alert(err);
      window.location.reload();
    }
  }

  const approve = async (_approve, token_address) => {
    try {
      const hash = await Tezos.wallet
        .at(token_address)
        .then((contract) => contract.methods.approve(_approve.to, _approve.amount).send())
        .then((op) => op.confirmation(1).then(() => op.opHash));
      console.log("hash", hash);
    } catch (err) {
      window.alert(err);
      window.location.reload();
    }
  }

  const getBalance = async (_address, token_address) => {
    try {
      const response = await Tezos.wallet
        .at(token_address)
        .then((contract) => {
          return contract.views.getBalance(_address).read();
        })
        .then((response) => { return response });
      return response.toString();
    } catch (err) {
      window.alert(err);
      window.location.reload();
    }
  }

  const getAllowance = async (_address, token_address) => {
    try {
      const response = await Tezos.wallet
        .at(token_address)
        .then((contract) => {
          return contract.views.getAllowance(account, _address).read();
        })
        .then((response) => { return response });
      return response.toString();
    } catch (err) {
      window.alert(err);
      window.location.reload();
    }
  }

  const burn = async (_burn, token_address) => {
    try {
      const hash = await Tezos.wallet
        .at(token_address)
        .then((contract) => contract.methods.burn(_burn.from, _burn.amount).send())
        .then((op) => op.confirmation(1).then(() => op.opHash));
      console.log("hash", hash);
    } catch (err) {
      window.alert(err);
      window.location.reload();
    }
  }

  return (
    <>
      <Navbar side={side} setSide={setSide} />
      {
        side == 1 ? <Create createdTokenAddress={createdTokenAddress} deploy={deploy} /> : <Interact readMetaData={readMetaData} _mint={mint} _transfer={transfer} _approve={approve} getBalance={getBalance} getAllowance={getAllowance} _burn={burn} />
      }

    </>
  )
}

export default App