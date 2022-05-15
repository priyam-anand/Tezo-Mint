import React, { useEffect, useState } from 'react'
import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
import { TempleWallet } from '@temple-wallet/dapp';
import Contract from "./fungibleContractAsset.json";

const App = () => {

  const [Tezos, setTezos] = useState(undefined);
  const [address, setAddress] = useState(undefined);

  const init = async () => {
    const _Tezos = new TezosToolkit('https://ithacanet.ecadinfra.com');
    TempleWallet.isAvailable()
      .then(() => {
        const mywallet = new TempleWallet('MyAwesomeDapp');
        mywallet
          .connect('ithacanet')
          .then(() => {
            _Tezos.setWalletProvider(mywallet);
            return mywallet.getPKH();
          })
          .then((pkh) => {
            console.log(`Your address: ${pkh}`);
            setAddress(pkh);
          });
      })
      .catch((err) => console.log(err));
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
  console.log(ascii_to_hexa("10"))


  const deploy = async () => {
    console.log(address)
    const tokenDetails = new MichelsonMap();
    tokenDetails.set('decimals', ascii_to_hexa("10"));
    tokenDetails.set('name', ascii_to_hexa('My Token'));
    tokenDetails.set('symbol', ascii_to_hexa('MT'));

    const tokenMetaData = new MichelsonMap();
    tokenMetaData.set(0, {
      token_id: 0,
      token_info: tokenDetails
    });
    Tezos.wallet.originate({
      code: Contract,
      storage: {
        administrator: address,
        balances: new MichelsonMap(),
        metadata: new MichelsonMap(),
        paused: false,
        token_metadata: tokenMetaData,
        totalSupply: 0
      }
    }).send()
      .then((originationOp) => {
        console.log(`Waiting for confirmation of origination...`);
        return originationOp.contract();
      })
      .then((contract) => {
        console.log(`Origination completed for ${contract.address}.`);
      })
      .catch((error) => console.log(`Error: ${JSON.stringify(error, null, 2)}`));

  }

  return (
    <div>
      <button onClick={deploy}>
        deploy
      </button>
    </div>
  )
}

export default App