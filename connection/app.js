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

    logout: function (address, sender, callback) {
        var self = this;

        Accounts.setProvider(self.web3.currentProvider)
        
        Accounts.deployed().then(async function (instance) {
            success = await instance.logout(address, {from: sender})
            return success
        }).then(function(success) {
            callback(success)
        })
    },

    login: function (login, password, sender, callback) {
        var self = this;

        Accounts.setProvider(self.web3.currentProvider)
        
        Accounts.deployed().then(async function (instance) {
            success = await instance.login(login, password, {from: sender})
            return success
        }).then(function(success) {
            callback(success)
        })
        // address = Accounts.login_per_address.call(login)
        // role = Accounts.role_per_address.call(address)
        // callback(address, role)
    },

    account: function(address, callback) {
        var self = this;

        Accounts.setProvider(self.web3.currentProvider)
        
        // Accounts.deployed().then(async function (instance) {
        //     success = await instance.(login, password, {from: sender})
        //     return success
        // }).then(function(success) {
        //     callback(success)
        // })
    }
}