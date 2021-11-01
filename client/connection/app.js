const contract = require('@truffle/contract')

const accounts_artifact = require('../../build/contracts/Accounts.json')
const Accounts = contract(accounts_artifact)

module.exports = {
    start: function (callback) {
        var self = this;

        Accounts.setProvider(self.web3.currentProvider)
        self.web3.eth.getAccounts((error, accounts) => {
            if (error != null) {
                console.log(error);
                return;
            }

            if (accounts.length == 0) {
                console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                return;
            }
            callback(accounts[0])
        })
    },

    showAccounts: function (callback) {
        var self = this

        Accounts.setProvider(self.web3.currentProvider)
        self.web3.eth.getAccounts((error, accounts) => {
            if (error != null) {
                console.log(error)
                return
            }

            if (accounts.length == 0) {
                console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
                return
            }
            callback(accounts)
        })
    },

    checkAuthData: function (login, password, sender, callback) {
        var self = this;

        Accounts.setProvider(self.web3.currentProvider)

        Accounts.deployed().then(async function (instance) {
            info = await instance.check_auth_data(login, password, { from: sender })
            return info
        }).then(function (info) {
            callback(info)
        })
    },

    getRole: function (account, callback) {
        var self = this

        Accounts.setProvider(self.web3.currentProvider)

        Accounts.deployed().then(async function (instance) {
            return await instance.get_role(account)
        }).then(function (role) {
            callback(role)
        })
    },

    account: function (account, role, callback) {
        var self = this;

        Accounts.setProvider(self.web3.currentProvider)

        Accounts.deployed().then(function (instance) {
                if (role === 'bank') {
                    return instance.banks.call(account)
                } else if (role === 'shop') {
                    return instance.shops.call(account)
                } else if (role === 'provider') {
                    return instance.providers.call(account)
                } else if (role === 'seller') {
                    return instance.sellers.call(account)
                } else if (role === 'customer') {
                    return instance.customers.call(account)
                } else if (role === 'admin') {
                    return instance.admins.call(account)
                }
            }).then(function (info) {
                callback(info)
            })
    },

    getBalance: function (account, callback) {
        var self = this;

        self.web3.eth.getBalance(account, (err, result) => {
            if (err != null) {
                console.log(err)
            } else {
                return result
            }
            
        }).then(function (balance) {
            callback(balance)
        })
    },

    getAdmins: function (callback) {
        var self = this;

        Accounts.setProvider(self.web3.currentProvider)

        Accounts.deployed().then( async function (instance) {
            const admins = []
            len = await instance.get_users_count()
            // console.log(len)
            for (let i = 0; i < len.toNumber(); i++) {
                candidate = await instance.admins.call(await instance.users.call(i))
                // console.log(candidate)
                if (candidate.login !== '') {
                    admins.push(candidate)
                } 
            }
            return admins
        }).then(function (admins) {
            callback(admins)
        })
    },

    getShops: function (callback) {
        var self = this;

        Accounts.setProvider(self.web3.currentProvider)

        Accounts.deployed().then( async function (instance) {
            const shops = []
            len = await instance.get_users_count()
            // console.log(len)
            for (let i = 0; i < len.toNumber(); i++) {
                candidate = await instance.shops.call(await instance.users.call(i))
                // console.log(candidate)
                if (candidate.name !== '') {
                    shops.push(candidate)
                } 
            }
            return shops
        }).then(function (shops) {
            callback(shops)
        })
    },

    getAsks: function(callback) {
        var self = this;

        Accounts.setProvider(self.web3.currentProvider)

        Accounts.deployed().then( async function (instance) {
            const forUp = []
            const forDown = []
            len = await instance.get_users_count()
            // console.log(len)
            for (let i = 0; i < len.toNumber(); i++) {
                candidate = await instance.shops.call(await instance.users.call(i))
                // console.log(candidate)
                if (candidate.name !== '') {
                    shops.push(candidate)
                } 
            }
            return shops
        }).then(function (shops) {
            callback(shops)
        })
    }
}