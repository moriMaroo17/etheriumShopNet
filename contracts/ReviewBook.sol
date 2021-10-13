// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './Accounts.sol';

contract ReviewBook is Accounts {

    struct Comment {
        address owner;
        address shop;
        string message;
        uint8 rate;
        uint128 likes;
        uint128 dislikes;
    }

    struct Reply {
        address owner;
        uint256 comment_id;
        string message;
        uint8 rate;
        uint128 likes;
        uint128 dislikes;
    }

    Comment[] comments;
    Reply[] replyes;

    function comment_shop(address _shop_address, string memory _message, uint8 _rate) public {
        require(sellers[msg.sender].shop_address != _shop_address);
        comments.push(Comment(msg.sender, _shop_address, _message, _rate, 0, 0));
        _update_rate(_shop_address);
    }

    function reply_on_comment(uint256 _comment_id, string memory _message, uint8 _rate) public {
        require(sellers[msg.sender].shop_address != comments[_comment_id].shop);
        replyes.push(Reply(msg.sender, _comment_id, _message, _rate, 0, 0));
        _update_rate(comments[_comment_id].shop);
    }

    function reply_on_comment(uint256 _comment_id, string memory _message) public {
        require(sellers[msg.sender].shop_address == comments[_comment_id].shop);
        replyes.push(Reply(msg.sender, _comment_id, _message, 0, 0, 0));
    }

    function _get_rates_per_shop(address _shop_address) internal view returns(uint16) {
        uint256 counter = 0;
        uint256 rate_sum = 0.00;
        for (uint256 i = 0; i < comments.length; i++) {
            Comment memory comment = comments[i];
            if (comment.shop == _shop_address && comment.likes > 10 && comment.likes > comment.dislikes) {
                rate_sum += 100 * (comment.rate * (comment.likes / comment.likes + comment.dislikes));
                counter++;
            }
        }
        return uint16(rate_sum / counter);
    }

    function _update_rate(address _shop_address) internal {
        shops[_shop_address].rate = _get_rates_per_shop(_shop_address);
    }
}