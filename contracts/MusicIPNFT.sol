// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MusicIPNFT is ERC721, Ownable {

    uint256 public tokenCounter;

    struct MusicIP {
        string title;
        string artist;
        string metadataURI;
        address creator;
        address royaltyContract;
        bool isActive;
    }

    mapping(uint256 => MusicIP) public musicIPs;

    event MusicIPMinted(
        uint256 indexed tokenId,
        address indexed creator,
        address royaltyContract
    );

    constructor() ERC721("Music IP NFT", "MIPNFT") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function mintMusicIP(
        address _creator,
        string calldata _title,
        string calldata _artist,
        string calldata _metadataURI,
        address _royaltyContract
    ) external onlyOwner returns (uint256) {
        require(_creator != address(0), "Invalid creator");
        require(_royaltyContract != address(0), "Invalid royalty contract");

        uint256 tokenId = ++tokenCounter;
        _safeMint(_creator, tokenId);

        musicIPs[tokenId] = MusicIP({
            title: _title,
            artist: _artist,
            metadataURI: _metadataURI,
            creator: _creator,
            royaltyContract: _royaltyContract,
            isActive: true
        });

        emit MusicIPMinted(tokenId, _creator, _royaltyContract);
        return tokenId;
    }

    function getMusicIP(uint256 _tokenId)
        external
        view
        returns (MusicIP memory)
    {
        return musicIPs[_tokenId];
    }
}
