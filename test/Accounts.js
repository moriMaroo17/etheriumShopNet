const { Keccak } = require('sha3');
const hash = new Keccak(256);

const Accounts = artifacts.require("Accounts")

contract("Accounts", (accounts) => {
    let [alice, bob, cane, dylan] = accounts
    let contractInstance

    beforeEach('should setup the contract instance', async () => {
        contractInstance = await Accounts.new({from: alice})
    })

    it('constructor creates admin account', async () => {
        role = await contractInstance.role_per_address.call(alice)
        admin_data = await contractInstance.admins.call(alice)
        customer_data = await contractInstance.customers.call(alice)

        assert.equal(role, 'Admin')
        assert.equal(admin_data['login'], 'max')
        assert.equal(admin_data['name'], 'max')
        assert.equal(customer_data['login'], 'max')
        assert.equal(customer_data['name'], 'max')
    })

    it('should customer create account', async () => {
        result = await contractInstance.add_customer(bob, 'bob', 'bob', '1234')
        role = await contractInstance.role_per_address.call(bob)
        customer_data = await contractInstance.customers.call(bob)
        password = await contractInstance.auth_data.call('bob')

        assert.equal(role, 'Customer')
        assert.equal(customer_data['login'], 'bob')
        assert.equal(customer_data['name'], 'bob')
        hash.update('1234')
        // Разобраться с проверкой записи пароля
        console.log(hash.digest())
        console.log(password)
        // assert.equal(password, hash.)
    })

    it('should add shop', async () => {
        result = await contractInstance.add_shop(cane, 'XXX', 'Moscow')
        role = await contractInstance.role_per_address.call(cane)
        shop_data = await contractInstance.shops.call(cane)
        
        assert.equal(role, 'Shop')
        assert.equal(shop_data['name'], 'XXX')
        assert.equal(shop_data['city'], 'Moscow')
        assert.equal(shop_data['shop_sellers'], undefined)
        assert.equal(shop_data['rate'], 0)
    })

    it('should customer can ask for up role', async () => {
        await contractInstance.add_customer(dylan, 'dylan', 'dylan', '1234')
        await contractInstance.ask_for_up({from: dylan})
    })

})