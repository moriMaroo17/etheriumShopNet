// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Accounts {

    string[7] roles = [
        "Bank",
        "Shop",
        "Provider",
        "Seller",
        "Customer",
        "Admin",
        "Guest"
    ];

    struct Bank {
        string name;
        mapping(address => uint128) creditors;
    }

    struct Shop {
        string name;
        string city;
        address[] shop_sellers;
        uint16 rate;
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
        string login;
        string name;
    }

    mapping(address => string) public role_per_address;
    mapping(string => bytes32) private auth_data;

    mapping(address => string) asks_for_change;

    mapping(address => Bank) banks;
    mapping(address => Shop) shops;
    mapping(address => Provider) providers;
    mapping(address => Seller) sellers;
    mapping(address => Customer) customers;
    mapping(address => Admin) admins;

    constructor() {
        admins[msg.sender] = Admin('max', 'max');
        customers[msg.sender] = Customer('max', 'max');
        role_per_address[msg.sender] = roles[5];
    }

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
        role_per_address[_user_address] = roles[3];
        shops[_shop_address].shop_sellers.push(_user_address);
        // delete customers[_user_address];
        delete asks_for_change[_user_address];
    }

    function down_role(address _user_address) public onlyRole(roles[5]) {
        customers[_user_address] = Customer(
            sellers[_user_address].login,
            sellers[_user_address].name
        );
        role_per_address[_user_address] = roles[4];
        delete sellers[_user_address];
        delete asks_for_change[_user_address];
    }

    function add_shop(
        address _address,
        string memory _name,
        string memory _city
    ) public onlyRole(roles[5]) {
        Shop memory shop;
        shop.name = _name;
        shop.city = _city;
        shop.rate = 0;
        shops[_address] = shop;
        role_per_address[_address] = roles[1];
    }

    function add_customer(
        address _new_address,
        string memory _login,
        string memory _name,
        string memory _password
    ) public {
        customers[_new_address] = Customer(_login, _name);
        role_per_address[_new_address] = roles[4];
        auth_data[_login] = keccak256(abi.encode(_password));
    }

    function add_admin(
        address _new_address,
        string memory _login,
        string memory _name,
        string memory _password
    ) public onlyRole(roles[5]) {
        admins[_new_address] = Admin(_login, _name);
        role_per_address[_new_address] = roles[5];
        auth_data[_login] = keccak256(abi.encode(_password));
    }

    // function switch_state(string memory _current_state)
    //     public
    //     onlyRole(roles[5])
    // {
    //     if (
    //         keccak256(abi.encode(_current_state)) ==
    //         keccak256(abi.encode(roles[5]))
    //     ) {
    //         customers[msg.sender] = Customer(
    //             admins[msg.sender].login,
    //             admins[msg.sender].name
    //         );
    //     } else {
    //         delete customers[msg.sender];
    //     }
    // }

    function removeShop(address _shop_address) public onlyRole(roles[5]) {
        Shop memory removing_shop = shops[_shop_address];
        for (uint24 i = 0; i < removing_shop.shop_sellers.length; i++) {
            down_role(removing_shop.shop_sellers[i]);
        }
        delete removing_shop;
    }

    function ask_for_up() public onlyRole(roles[4]) {
        asks_for_change[msg.sender] = "up";
    }

    function ask_for_down() public onlyRole(roles[3]) {
        asks_for_change[msg.sender] = "down";
    }
}
