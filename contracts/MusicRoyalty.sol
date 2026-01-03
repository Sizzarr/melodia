// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract MusicRoyalty {

    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    struct MusicInfo {
        string title;
        string artist;
        uint256 totalRoyaltyValue;
        uint256 totalShares;
        string legalDocument;
        bool isActive;
    }

    MusicInfo public music;

    address public admin;
    address public kycRegistry;

    mapping(address => bool) public frozen;
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowances;

    uint256 public maxHolding = 1000 ether;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event AccountFrozen(address indexed account, string reason);
    event AccountUnfrozen(address indexed account);
    event MusicUpdated(string title, uint256 totalRoyaltyValue);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier notFrozen(address _account) {
        require(!frozen[_account], "Account is frozen");
        _;
    }

    modifier onlyVerified(address _account) {
        require(_isVerified(_account), "Not KYC verified");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        address _kycRegistry,
        string memory _title,
        string memory _artist,
        uint256 _totalRoyaltyValue,
        uint256 _totalShares
    ) {
        require(_kycRegistry != address(0), "Invalid KYC registry");

        name = _name;
        symbol = _symbol;
        admin = msg.sender;
        kycRegistry = _kycRegistry;

        music = MusicInfo({
            title: _title,
            artist: _artist,
            totalRoyaltyValue: _totalRoyaltyValue,
            totalShares: _totalShares,
            legalDocument: "",
            isActive: true
        });

        totalSupply = _totalShares;
        balances[msg.sender] = _totalShares;

        emit Transfer(address(0), msg.sender, _totalShares);
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    function transfer(
        address _to,
        uint256 _value
    )
        public
        notFrozen(msg.sender)
        notFrozen(_to)
        onlyVerified(msg.sender)
        onlyVerified(_to)
        returns (bool)
    {
        require(balances[msg.sender] >= _value, "Insufficient balance");
        require(balances[_to] + _value <= maxHolding, "Exceeds max holding");

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    )
        public
        notFrozen(_from)
        notFrozen(_to)
        onlyVerified(_from)
        onlyVerified(_to)
        returns (bool)
    {
        require(balances[_from] >= _value, "Insufficient balance");
        require(allowances[_from][msg.sender] >= _value, "Insufficient allowance");

        balances[_from] -= _value;
        balances[_to] += _value;
        allowances[_from][msg.sender] -= _value;

        emit Transfer(_from, _to, _value);
        return true;
    }

    function freezeAccount(address _account, string calldata _reason)
        external
        onlyAdmin
    {
        frozen[_account] = true;
        emit AccountFrozen(_account, _reason);
    }

    function unfreezeAccount(address _account) external onlyAdmin {
        frozen[_account] = false;
        emit AccountUnfrozen(_account);
    }

    function forceTransfer(
        address _from,
        address _to,
        uint256 _value
    ) external onlyAdmin {
        balances[_from] -= _value;
        balances[_to] += _value;
        emit Transfer(_from, _to, _value);
    }

    function setLegalDocument(string calldata _ipfsHash) external onlyAdmin {
        music.legalDocument = _ipfsHash;
    }

    function _isVerified(address _account) internal view returns (bool) {
        if (_account == admin) return true;

        (bool success, bytes memory data) = kycRegistry.staticcall(
            abi.encodeWithSignature("isVerified(address)", _account)
        );

        if (!success) return false;
        return abi.decode(data, (bool));
    }
}
