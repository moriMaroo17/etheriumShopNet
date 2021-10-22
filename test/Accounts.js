const Accounts = artifacts.require("Accounts")

contract("Accounts", (accounts) => {
    let [alice, bob, cane, dylan] = accounts
    let contractInstance

    beforeEach('should setup the contract instance', async () => {
        contractInstance = await Accounts.new({from: alice})
    })

    it('constructor creates admin account', async () => {
        // role = await contractInstance.role_per_address.call(alice)
        admin_data = await contractInstance.admins.call(alice)
        customer_data = await contractInstance.customers.call(alice)

        // assert.equal(role, 'Admin')
        assert.equal(admin_data['login'], 'max')
        assert.equal(admin_data['name'], 'max')
        assert.equal(customer_data['login'], 'max')
        assert.equal(customer_data['name'], 'max')
    })

    it('should customer create account', async () => {
        result = await contractInstance.add_customer(bob, 'bob', 'bob', '1234')
        // role = await contractInstance.role_per_address.call(bob)
        customer_data = await contractInstance.customers.call(bob)
        // password = await contractInstance.auth_data.call('bob')
        // console.log(password)
        // assert.equal(role, 'Customer')
        // console.log(role)
        assert.equal(customer_data['login'], 'bob')
        assert.equal(customer_data['name'], 'bob')
    })

    it('should add shop', async () => {
        result = await contractInstance.add_shop(cane, 'XXX', 'Moscow')
        role = await contractInstance.role_per_address.call(cane)
        shop_data = await contractInstance.shops.call(cane)
        
        // assert.equal(role, 'Shop')
        assert.equal(shop_data['name'], 'XXX')
        assert.equal(shop_data['city'], 'Moscow')
        assert.equal(shop_data['shop_sellers'], undefined)
        assert.equal(shop_data['rate'], 0)
    })

    it('should customer ask for up role', async () => {
        await contractInstance.add_customer(dylan, 'dylan', 'dylan', '1234')
        await contractInstance.ask_for_up(cane, {from: dylan})

        const ask = await contractInstance.asks_for_up.call(dylan)
        assert.equal(ask, cane)
    })

    it('should admin up role', async () => {
        await contractInstance.add_shop(cane, 'XXX', 'Moscow')
        await contractInstance.add_customer(dylan, 'dylan', 'dylan', '1234')
        await contractInstance.ask_for_up(cane, {from: dylan})

        await contractInstance.up_role(dylan)
        // role = await contractInstance.role_per_address.call(dylan)
        seller_data = await contractInstance.sellers.call(dylan)
        customer_data = await contractInstance.customers.call(dylan)
        shop_data = await contractInstance.shops.call(cane)
        result = await contractInstance.check_shop_seller(cane, dylan)
        clearense_asks = await contractInstance.asks_for_up.call(dylan)

        assert.equal(seller_data['name'], customer_data['name'])
        assert.equal(seller_data['login'], customer_data['login'])
        assert.equal(seller_data['shop_address'], cane)
        assert.equal(seller_data['city'], shop_data['city'])
        assert.equal(true, result)
        assert.equal('0x0000000000000000000000000000000000000000', clearense_asks)
    })

    it('should seller asks for down role', async () => {
        await contractInstance.add_shop(cane, 'XXX', 'Moscow')
        await contractInstance.add_customer(dylan, 'dylan', 'dylan', '1234')
        await contractInstance.ask_for_up(cane, {from: dylan})
        await contractInstance.up_role(dylan)

        await contractInstance.ask_for_down({from: dylan})

        const ask = await contractInstance.asks_for_down.call(dylan)
        assert.equal(ask, 'down')

    })

    it('should admin down role', async () => {
        await contractInstance.add_shop(cane, 'XXX', 'Moscow')
        await contractInstance.add_customer(dylan, 'dylan', 'dylan', '1234')
        await contractInstance.ask_for_up(cane, {from: dylan})
        await contractInstance.up_role(dylan)
        await contractInstance.ask_for_down({from: dylan})

        await contractInstance.down_role(dylan)

        // role = await contractInstance.role_per_address.call(dylan)
        seller_data = await contractInstance.sellers.call(dylan)
        customer_data = await contractInstance.customers.call(dylan)
        shop_data = await contractInstance.shops.call(cane)
        result = await contractInstance.check_shop_seller(cane, dylan)
        clearense_asks = await contractInstance.asks_for_down.call(dylan)
        seller_address = await contractInstance.get_shop_seller(cane, dylan)

        // assert.equal('Customer', role)
        assert.equal(false, result)
        assert.equal('', clearense_asks)
    })

    it('should admin add one more admin', async () => {
        await contractInstance.add_admin(bob, 'bob', 'bob', '1234')

        // role = await contractInstance.role_per_address.call(bob)
        admin_data = await contractInstance.admins.call(bob)

        // assert.equal('Admin', role)
        assert.equal('bob', admin_data['login'])
        assert.equal('bob', admin_data['name'])
        await contractInstance.add_shop(cane, 'XXX', 'Moscow', {from: bob})
    })

    it('should admin remove shop', async () => {
        await contractInstance.add_shop(cane, 'XXX', 'Moscow')
        await contractInstance.add_customer(dylan, 'dylan', 'dylan', '1234')
        await contractInstance.ask_for_up(cane, {from: dylan})
        await contractInstance.up_role(dylan)

        seller_role = await contractInstance.role_per_address.call(dylan)

        // assert.equal('Seller', seller_role)
        
        await contractInstance.remove_shop(cane)

        shop_role = await contractInstance.role_per_address.call(cane)
        customer_role = await contractInstance.role_per_address.call(dylan)

        // assert.equal('', shop_role)
        // assert.equal('Customer', customer_role)
    })

})