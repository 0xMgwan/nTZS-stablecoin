// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/metatx/ERC2771ContextUpgradeable.sol";

/**
 * @title UpgradeableNTZS - NEDA Tanzania Shilling Stablecoin
 * @notice A regulated stablecoin pegged 1:1 to the Tanzania Shilling (TSH) with advanced features:
 * - Mintable: Controlled token minting by authorized minters
 * - Burnable: Token burning for redemptions
 * - Pausable: Emergency stop for all transfers
 * - Permit: Gasless approvals (EIP-2612)
 * - Blocklist: Regulatory compliance blacklisting
 * - ERC-2771 meta-transactions for gasless transactions
 * - UUPS upgradability for future improvements
 * 
 * Built to comply with local stablecoin standards (CNGN, ZARP, IDRX)
 */
contract UpgradeableNTZS is 
    Initializable, 
    ERC20Upgradeable, 
    ERC20BurnableUpgradeable,
    ERC20PermitUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    ERC2771ContextUpgradeable(address(0)),
    UUPSUpgradeable 
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant BLACKLISTER_ROLE = keccak256("BLACKLISTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    
    // Mapping of blacklisted addresses
    mapping(address => bool) private _blacklisted;
    
    // Store the trusted forwarder address
    address private _trustedForwarder;
    
    // Events
    event Blacklisted(address indexed account);
    event BlacklistRemoved(address indexed account);
    event TrustedForwarderChanged(address indexed oldForwarder, address indexed newForwarder);
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }
    
    /**
     * @dev Initializes the contract with roles and settings
     * @param defaultAdmin The address that will have the DEFAULT_ADMIN_ROLE
     * @param trustedForwarder The address of the trusted forwarder for meta-transactions
     */
    function initialize(address defaultAdmin, address trustedForwarder) public initializer {
        __ERC20_init("NEDA Tanzania Shilling", "NTZS");
        __ERC20Burnable_init();
        __ERC20Permit_init("NEDA Tanzania Shilling");
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();
        
        // Initialize the trusted forwarder
        _trustedForwarder = trustedForwarder;
        
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin);
        _grantRole(BURNER_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, defaultAdmin);
        _grantRole(BLACKLISTER_ROLE, defaultAdmin);
        _grantRole(UPGRADER_ROLE, defaultAdmin);
    }
    
    /**
     * @dev Returns the number of decimals used for token - override to use 2 decimals for TSH
     */
    function decimals() public view virtual override returns (uint8) {
        return 2; // TSH typically uses 2 decimal places
    }
    
    /**
     * @dev Mint tokens to a specified address
     * @param to The address that will receive the minted tokens
     * @param amount The amount of tokens to mint
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) whenNotPaused {
        require(!isBlacklisted(to), "NTZS: recipient is blacklisted");
        _mint(to, amount);
    }
    
    /**
     * @dev Burn tokens from caller's account (requires BURNER_ROLE)
     * @param amount The amount of tokens to burn
     */
    function burn(uint256 amount) public virtual override onlyRole(BURNER_ROLE) whenNotPaused {
        super.burn(amount);
    }
    
    /**
     * @dev Burn tokens from a specified account (requires BURNER_ROLE and allowance)
     * @param account The address to burn tokens from
     * @param amount The amount of tokens to burn
     */
    function burnFrom(address account, uint256 amount) public virtual override onlyRole(BURNER_ROLE) whenNotPaused {
        super.burnFrom(account, amount);
    }
    
    /**
     * @dev Pause token transfers
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Add an address to the blacklist
     * @param account The address to blacklist
     */
    function blacklist(address account) public onlyRole(BLACKLISTER_ROLE) {
        require(!_blacklisted[account], "NTZS: account already blacklisted");
        _blacklisted[account] = true;
        emit Blacklisted(account);
    }
    
    /**
     * @dev Remove an address from the blacklist
     * @param account The address to remove from the blacklist
     */
    function removeFromBlacklist(address account) public onlyRole(BLACKLISTER_ROLE) {
        require(_blacklisted[account], "NTZS: account not blacklisted");
        _blacklisted[account] = false;
        emit BlacklistRemoved(account);
    }
    
    /**
     * @dev Check if an address is blacklisted
     * @param account The address to check
     * @return bool True if the address is blacklisted
     */
    function isBlacklisted(address account) public view returns (bool) {
        return _blacklisted[account];
    }
    
    /**
     * @dev Returns the address of the trusted forwarder
     */
    function getTrustedForwarder() public view returns (address) {
        return _trustedForwarder;
    }
    
    /**
     * @dev Sets the trusted forwarder address
     */
    function setTrustedForwarder(address newTrustedForwarder) public onlyRole(DEFAULT_ADMIN_ROLE) {
        address oldForwarder = _trustedForwarder;
        _trustedForwarder = newTrustedForwarder;
        emit TrustedForwarderChanged(oldForwarder, newTrustedForwarder);
    }
    
    /**
     * @dev Override _msgSender to support meta-transactions
     */
    function _msgSender() internal view virtual override(ContextUpgradeable, ERC2771ContextUpgradeable) returns (address sender) {
        return ERC2771ContextUpgradeable._msgSender();
    }
    
    /**
     * @dev Override _msgData to support meta-transactions
     */
    function _msgData() internal view virtual override(ContextUpgradeable, ERC2771ContextUpgradeable) returns (bytes calldata) {
        return ERC2771ContextUpgradeable._msgData();
    }
    
    /**
     * @dev Override _update to add pausable and blacklist checks
     * @param from The address tokens are transferred from
     * @param to The address tokens are transferred to
     * @param value The amount of tokens being transferred
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override whenNotPaused {
        require(!isBlacklisted(from), "NTZS: sender is blacklisted");
        require(!isBlacklisted(to), "NTZS: recipient is blacklisted");
        super._update(from, to, value);
    }
    
    /**
     * @dev Override _contextSuffixLength for ERC2771 compatibility
     */
    function _contextSuffixLength() internal view virtual override(ContextUpgradeable, ERC2771ContextUpgradeable) returns (uint256) {
        return ERC2771ContextUpgradeable._contextSuffixLength();
    }
    
    /**
     * @dev Function that should revert when `msg.sender` is not authorized to upgrade the contract
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}
    
    /**
     * @dev This empty reserved space is put in place to allow future versions to add new
     * variables without shifting down storage in the inheritance chain.
     */
    uint256[48] private __gap;
}
