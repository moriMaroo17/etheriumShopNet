// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Accounts {
    string[7] roles = [
        "Bank",
        "Shop",
        "Provider",
        "Seller",
        "Buyer",
        "Admin",
        "Guest"
    ];
    mapping(address => string) public role_per_address;
    mapping(string => string) private auth_data;

    mapping(address => Bank) banks;
    mapping(address => Shop) shops;
    mapping(address => Provider) providers;
    mapping(address => Seller) sellers;
    mapping(address => Customer) customers;
    mapping(address => Admin) admins;

    struct Bank {
        string name;
        mapping(address => uint128) creditors;
    }

    struct Shop {
        string name;
        string city;
        uint32 rate;
    }

    struct Provider {
        string name;
    }

    struct Seller {
        string login;
        string name;
        string city;
        address shop_address;
    }

    struct Customer {
        string login;
        string name;
    }

    struct Admin {
        string name;
    }

    // struct Comment {
    //     address owner;
    //     uint128 likes;
    //     uint128 dislikes;
    // }

    modifier onlyRole(string memory _role) {
        require(
            keccak256(abi.encode(role_per_address[msg.sender])) ==
                keccak256(abi.encode(_role)),
            "Permisson denied."
        );
        _;
    }

    function up_role(address _user_address, address _shop_address)
        public
        onlyRole(roles[5])
    {
        sellers[_user_address] = Seller(
            customers[_user_address].login,
            customers[_user_address].name,
            shops[_shop_address].city,
            _shop_address
        );
        delete customers[_user_address];
    }

    function down_role(address _user_address) public onlyRole(roles[5]) {
        customers[_user_address] = Customer(sellers[_user_address].login, sellers[_user_address].name);
        delete sellers[_user_address];
    }

    function add_shop(address _address, string memory _name, string memory _city) internal onlyRole(roles[5]) {
        shops[_address] = Shop(_name, _city, 0);
    }

    function add_customer(address _new_address, string memory _login, string memory _name) internal {
        customers[_new_address] = Customer(_login, _name);
    }

}
