// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Accounts {

    enum Role {
        Bank,
        Shop,
        Provider,
        Seller,
        Customer,
        Admin,
        Guest
    }

    // used for tests
    // string[7] roles = [
    //     "Bank",
    //     "Shop",
    //     "Provider",
    //     "Seller",
    //     "Customer",
    //     "Admin",
    //     "Guest"
    // ];

    struct Bank {
        string name;
        mapping(address => uint128) creditors;
    }

    struct Shop {
        string name;
        string city;
        address[] shop_sellers;
        uint16 rate;
        uint using_reviews;
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

    mapping(address => Role) public role_per_address;
    mapping(string => bytes32) private auth_data;
    mapping(string => address) public login_per_address;

    mapping(address => address) public asks_for_up;
    mapping(address => string) public asks_for_down;

    mapping(address => Bank) public banks;
    mapping(address => Shop) public shops;
    mapping(address => Provider) public providers;
    mapping(address => Seller) public sellers;
    mapping(address => Customer) public customers;
    mapping(address => Admin) public admins;

    constructor() {
        admins[msg.sender] = Admin('max', 'max');
        customers[msg.sender] = Customer('max', 'max');
        auth_data['max'] = keccak256(abi.encode('1234'));
        role_per_address[msg.sender] = Role.Admin;
        login_per_address['max'] = msg.sender;
    }

    modifier onlyRole(Role _role) {
        require(
            role_per_address[msg.sender] == _role,
            "Permisson denied."
        );
        _;
    }
    // test func. will be remove on deploy
    function check_shop_seller(address _shop_address, address _seller_address) external view returns (bool) {
        for (uint i = 0; i < shops[_shop_address].shop_sellers.length; i++) {
            if (shops[_shop_address].shop_sellers[i] == _seller_address) {
                return true;
            }
        }
        return false;
    }
    // test func. will be remove on deploy
    function get_shop_seller(address _shop_address, address _seller_address) external view returns (address) {
        for (uint i = 0; i < shops[_shop_address].shop_sellers.length; i++) {
            if (shops[_shop_address].shop_sellers[i] == _seller_address) {
                return shops[_shop_address].shop_sellers[i];
            }
        }
    }

    function check_auth_data(string memory _login, string memory _password) external view returns (bool) {
        return (auth_data[_login] == keccak256(abi.encode(_password)) && msg.sender == login_per_address[_login]);
    }

    function up_role(address _user_address)
        public
        onlyRole(Role.Admin)
    {
        address shop_address = asks_for_up[_user_address];
        sellers[_user_address] = Seller(
            customers[_user_address].login,
            customers[_user_address].name,
            shops[shop_address].city,
            shop_address
        );
        role_per_address[_user_address] = Role.Seller;
        shops[shop_address].shop_sellers.push(_user_address);
        // delete customers[_user_address];
        delete asks_for_up[_user_address];
    }

    function down_role(address _user_address) public onlyRole(Role.Admin) {
        customers[_user_address] = Customer(
            sellers[_user_address].login,
            sellers[_user_address].name
        );
        address[] storage shop_sellers = shops[sellers[_user_address].shop_address].shop_sellers;
        for (uint24 i = 0; i < shop_sellers.length; i++) {
            if (shop_sellers[i] == _user_address) {
                delete shop_sellers[i];
                shop_sellers[i] = shop_sellers[shop_sellers.length-1];
                delete shop_sellers[shop_sellers.length-1];
                break;
            } 
        }
        role_per_address[_user_address] = Role.Customer;
        delete sellers[_user_address];
        delete asks_for_down[_user_address];
    }

    function add_shop(
        address _address,
        string memory _name,
        string memory _city
    ) public onlyRole(Role.Admin) {
        Shop memory shop;
        shop.name = _name;
        shop.city = _city;
        shop.rate = 0;
        shop.using_reviews = 0;
        shops[_address] = shop;
        role_per_address[_address] = Role.Shop;
    }

    function add_customer(
        address _new_address,
        string memory _login,
        string memory _name,
        string memory _password
    ) public {
        customers[_new_address] = Customer(_login, _name);
        role_per_address[_new_address] = Role.Customer;
        auth_data[_login] = keccak256(abi.encode(_password));
        login_per_address[_login] = _new_address;
    }

    function add_admin(
        address _new_address,
        string memory _login,
        string memory _name,
        string memory _password
    ) public onlyRole(Role.Admin) {
        admins[_new_address] = Admin(_login, _name);
        role_per_address[_new_address] = Role.Admin;
        auth_data[_login] = keccak256(abi.encode(_password));
    }

    function remove_shop(address _shop_address) public onlyRole(Role.Admin) {
        // Shop memory removing_shop = shops[_shop_address];
        for (uint24 i = 0; i < shops[_shop_address].shop_sellers.length; i++) {
            down_role(shops[_shop_address].shop_sellers[i]);
        }
        delete role_per_address[_shop_address];
        delete shops[_shop_address];
    }

    function ask_for_up(address _shop_address) public onlyRole(Role.Customer) {
        asks_for_up[msg.sender] = _shop_address;
    }

    function ask_for_down() public onlyRole(Role.Seller) {
        asks_for_down[msg.sender] = "down";
    }
}
