// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './Accounts.sol';

contract ReviewBook is Accounts {

    struct Comment {
        address owner;
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

    // Comment[] public comments;
    // Reply[] public replyes;

    mapping(address => Comment[]) public comments;
    mapping(address => Reply[]) public replyes;

    function get_comment(address _shop_address, uint _index) public view returns (Comment memory) {
        return comments[_shop_address][_index];
    }

    function get_reply(address _shop_address, uint _index) public view returns (Reply memory) {
        return replyes[_shop_address][_index];
    }

    function comment_shop(address _shop_address, string memory _message, uint8 _rate) public {
        require(sellers[msg.sender].shop_address != _shop_address);
        comments[_shop_address].push(Comment(msg.sender, _message, _rate, 0, 0));
    }

    function reply_on_comment_by_seller(uint256 _comment_id, address _shop_address, string memory _message) public {
        require(sellers[msg.sender].shop_address == _shop_address);
        replyes[_shop_address].push(Reply(msg.sender, _comment_id, _message, 0, 0, 0));
    }
    
    function reply_on_comment(uint256 _comment_id, address _shop_address, string memory _message, uint8 _rate) public {
        require(sellers[msg.sender].shop_address != _shop_address);
        replyes[_shop_address].push(Reply(msg.sender, _comment_id, _message, _rate, 0, 0));
    }

    // function _get_rates_per_shop(address _shop_address) internal view returns(uint16) {
    //     uint256 counter = 0;
    //     uint256 rate_sum = 0;
    //     for (uint256 i = 0; i < comments.length; i++) {
    //         Comment memory comment = comments[i];
    //         if (comment.shop == _shop_address && comment.likes > 10 && comment.likes > comment.dislikes) {
    //             rate_sum += 100 * (comment.rate * (comment.likes / comment.likes + comment.dislikes));
    //             counter++;
    //         }
    //     }
    //     return uint16(rate_sum / counter);
    // }

    function _check_review_for_using(address _shop_address, uint _index) internal view returns (bool) {
        Comment memory comment = comments[_shop_address][_index];
        
        if (comment.likes > 10 && comment.likes > comment.dislikes) {
            return true;
        }
        return false;
    }

    function _check_reply_for_using(address _shop_address, uint _index) internal view returns (bool) {
        Reply memory reply = replyes[_shop_address][_index];
        
        if (reply.likes > 10 && reply.likes > reply.dislikes && reply.rate != 0) {
            return true;
        }
        return false;
    }

    function _update_rate(address _shop_address, uint16 _rate) internal {
        shops[_shop_address].rate = _get_rates_per_shop(_shop_address, _rate);
        
    }

    function _get_rates_per_shop(address _shop_address, uint16 _rate) internal view returns(uint16) {
        return uint16((shops[_shop_address].rate + _rate) / shops[_shop_address].using_reviews);
    }
}