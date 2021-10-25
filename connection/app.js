const contract = require('@truffle/contract')

const accounts_artifact = require('../build/contracts/Accounts.json')
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
            info = await instance.check_auth_data(login, password, {from: sender})
            return info
        }).then(function(info) {
            callback(info)
        }) 
    },

    account: function(login, password, callback) {
        var self = this;

        Accounts.setProvider(self.web3.currentProvider)
        
        Accounts.deployed().then(async function (instance) {
            info = await instance.get_auth_data(login, password)
            return info
        }).then(function(info) {
            callback(info)
        })
    }
}