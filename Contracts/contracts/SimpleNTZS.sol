// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title SimpleNTZS - NEDA Tanzania Shilling Stablecoin (Non-upgradeable)
 * @notice A regulated stablecoin pegged 1:1 to the Tanzania Shilling (TSH) with:
 * - Mintable: Controlled token minting by authorized minters
 * - Burnable: Token burning for redemptions
 * - Pausable: Emergency stop for all transfers
 * - Permit: Gasless approvals (EIP-2612)
 * - Blocklist: Regulatory compliance blacklisting
 * 
 * Built to comply with local stablecoin standards (CNGN, ZARP, IDRX)
 */
contract SimpleNTZS is ERC20, ERC20Burnable, ERC20Permit, Pausable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant BLACKLISTER_ROLE = keccak256("BLACKLISTER_ROLE");
    
    // Mapping of blacklisted addresses
    mapping(address => bool) private _blacklisted;
    
    // Events
    event Blacklisted(address indexed account);
    event BlacklistRemoved(address indexed account);
    
    /**
     * @dev Constructor initializes the contract with basic roles
     * @param defaultAdmin The address that will have the DEFAULT_ADMIN_ROLE
     */
    constructor(address defaultAdmin) 
        ERC20("NEDA Tanzania Shilling", "NTZS") 
        ERC20Permit("NEDA Tanzania Shilling") 
    {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(MINTER_ROLE, defaultAdmin);
        _grantRole(BURNER_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, defaultAdmin);
        _grantRole(BLACKLISTER_ROLE, defaultAdmin);
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
}
