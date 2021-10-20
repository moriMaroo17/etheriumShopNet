const ReviewBook = artifacts.require("ReviewBook")

contract("ReviewBook", (accounts) => {
    let [alice, bob, cane, dylan, eaphy] = accounts
    let contractInstance

    beforeEach('should setup the contract instance', async () => {
        contractInstance = await ReviewBook.new({from: alice})

        await contractInstance.add_customer(bob, 'bob', 'bob', '1234')
        await contractInstance.add_shop(cane, 'XXX', 'Moscow')
        await contractInstance.add_customer(dylan, 'dylan', 'dylan', '1234')
        await contractInstance.ask_for_up(cane, {from: dylan})
        await contractInstance.up_role(dylan)
    })

    it('should customer add a comment', async () => {
        await contractInstance.comment_shop(cane, "very good", 10, {from: bob})

        comment = await contractInstance.get_comment(cane, 0);
        // console.log(comment)
        assert.equal(comment['owner'], bob)
        assert.equal(comment['message'], 'very good')
        assert.equal(comment['rate'], '10')
        assert.equal(comment['likes'], '0')
        assert.equal(comment['dislikes'], '0')
    })

    it('should another customer reply on comment', async () => {
        await contractInstance.comment_shop(cane, "very good", 10, {from: bob})
        await contractInstance.add_customer(eaphy, 'eaphy', 'eaphy', '1234')

        await contractInstance.reply_on_comment(0, cane, 'agree', 10, {from: eaphy})

        reply = await contractInstance.get_reply(cane, 0);

        assert.equal(reply['owner'], eaphy)
        assert.equal(reply['comment_id'], '0')
        assert.equal(reply['message'], 'agree')
        assert.equal(reply['rate'], '10')
        assert.equal(reply['likes'], '0')
        assert.equal(reply['dislikes'], '0')
    })

    it('should seller reply on comment', async () => {
        await contractInstance.comment_shop(cane, "very good", 10, {from: bob})

        await contractInstance.reply_on_comment_by_seller(0, cane, 'agree', {from: dylan})

        reply = await contractInstance.get_reply(cane, 0);

        assert.equal(reply['owner'], dylan)
        assert.equal(reply['comment_id'], '0')
        assert.equal(reply['message'], 'agree')
        assert.equal(reply['rate'], '0')
        assert.equal(reply['likes'], '0')
        assert.equal(reply['dislikes'], '0')
    })

})