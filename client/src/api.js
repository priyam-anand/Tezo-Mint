import { TezosToolkit, MichelsonMap } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import Contract from "./fungibleContractAsset.json"


const Tezos = new TezosToolkit('https://rpczero.tzbeta.net/');
const wallet = new BeaconWallet({
    name: 'Simple Storage'
});
const _address = '';

const init = () =>
    new Promise(async (resolve, reject) => {
        // const activeAccount = await wallet.client.getActiveAccount();
        // if (activeAccount) {
        //     resolve();
        // } else {
        try {
            await wallet.requestPermissions({
                network: { type: 'jakartanet' }
            });
            console.log(wallet)
            Tezos.setWalletProvider(wallet);
            resolve(wallet);
        } catch (err) {
            console.log(err);
            reject(err);
        }
        // }

    });

const getAccount = async () => {
    const _account = await wallet.client.getActiveAccount();
    if (_account)
        return { connected: true, account: _account }
    try {
        await wallet.requestPermissions({
            network: { type: 'jakartanet' }
        });
        Tezos.setWalletProvider(wallet);
    } catch (err) {
        return { connected: false, account: null }
    }
}

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

export const deploy = (name, symbol, decimals, account) => {
    return new Promise(async (resolve, reject) => {
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
                    administrator: account.account.address,
                    balances: new MichelsonMap(),
                    metadata: new MichelsonMap(),
                    paused: false,
                    token_metadata: tokenMetaData,
                    totalSupply: 0
                }
            }).send();
            const contract = await contractInstance.contract();
            resolve(contract.address);
        } catch (error) {
            reject(error);
        }
    })

}

export const readMetaData = async (token_address) => {
    return new Promise(async (resolve, reject) => {
        try {
            const contractIni = await Tezos.wallet.at(token_address);
            const storage = await contractIni.storage();
            const metadata = (await storage.token_metadata.get('')).token_info;
            const name = hex_to_ascii(await metadata.get('name'));
            const symbol = hex_to_ascii(await metadata.get('symbol'));
            const decimals = hex_to_ascii(await metadata.get('decimals'));
            resolve({
                name: name,
                symbol: symbol,
                decimals: decimals
            })
        } catch (error) {
            reject(error);
        }
    })
}

export const mint = async (_mint, token_address) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hash = await Tezos.wallet
                .at(token_address)
                .then((contract) => contract.methods.mint(_mint.to, _mint.amount).send())
                .then((op) => op.confirmation(1).then(() => op.opHash));
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

export const transfer = async (_transfer, token_address) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hash = await Tezos.wallet
                .at(token_address)
                .then((contract) => contract.methods.transfer(_transfer.from, _transfer.to, _transfer.amount).send())
                .then((op) => op.confirmation(1).then(() => op.opHash));
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

export const approve = async (_approve, token_address) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hash = await Tezos.wallet
                .at(token_address)
                .then((contract) => contract.methods.approve(_approve.to, _approve.amount).send())
                .then((op) => op.confirmation(1).then(() => op.opHash));
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

export const getBalance = async (_address, token_address) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await Tezos.wallet
                .at(token_address)
                .then((contract) => {
                    return contract.views.getBalance(_address).read();
                })
                .then((response) => { return response });
            resolve(response.toString());
        } catch (error) {
            reject(error);
        }
    })
}

export const getAllowance = async (_address, token_address, account) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await Tezos.wallet
                .at(token_address)
                .then((contract) => {
                    return contract.views.getAllowance(account.account.address, _address).read();
                })
                .then((response) => { return response });
            resolve(response.toString());
        } catch (error) {
            reject(error);
        }
    })
}

export const burn = async (_burn, token_address) => {
    return new Promise(async (resolve, reject) => {
        try {
            const hash = await Tezos.wallet
                .at(token_address)
                .then((contract) => contract.methods.burn(_burn.from, _burn.amount).send())
                .then((op) => op.confirmation(1).then(() => op.opHash));
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

export const getAccountBalance = (account) => {
    return new Promise(async (resolve, reject) => {
        try {
            const balance = await Tezos.tz.getBalance(account);
            resolve(balance.toString())
        } catch (error) {
            reject(error);
        }
    })
}

export { getAccount, init };