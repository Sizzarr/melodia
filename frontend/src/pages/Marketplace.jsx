import React, { useEffect, useState } from "react";
import { CONTRACTS } from "../config/contracts";
import { ethers } from "ethers";
import { Search, Filter, Play, ArrowRight, Music } from "lucide-react";

export default function Marketplace() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadSongs = async () => {
    try {
        if (typeof window.ethereum === "undefined") return;
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(
          CONTRACTS.musicIPNFT.address,
          CONTRACTS.musicIPNFT.abi,
          provider
        );
    
        const total = await contract.tokenCounter();
        const items = [];

        for (let i = 1; i <= total; i++) {
            const song = await contract.getMusicIP(i);
            if (song.isActive) {
                items.push({
                    id: i,
                    title: song.title,
                    artist: song.artist,
                    metadata: song.metadataURI,
                    royaltyContract: song.royaltyContract
                });
            }
        }
    
        setSongs(items);
    } catch (err) {
        console.error("Marketplace Load Error:", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white pt-24 pb-12 px-6 relative overflow-hidden">
       {/* BACKGROUND ELEMENTS */}
       <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-900 -z-20" />
       <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent_40%)] -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    Discover <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Rare Music</span>
                </h1>
                <p className="text-gray-400">Invest in royalties and support your favorite artists.</p>
            </div>

            {/* SEARCH BAR */}
            <div className="relative w-full md:w-96 group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-500 group-focus-within:text-purple-400 transition" />
                </div>
                <input
                    type="text"
                    placeholder="Search songs, artists..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-purple-500 transition shadow-lg backdrop-blur-sm"
                />
            </div>
        </div>

        {/* CATEGORIES (Visual Only) */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide">
            {["All Genres", "Pop", "Rock", "Jazz", "Electronic", "Classical"].map((genre, idx) => (
                <button 
                    key={genre}
                    className={`px-5 py-2 rounded-full border text-sm font-medium transition whitespace-nowrap ${
                        idx === 0 
                        ? "bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/25" 
                        : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white hover:bg-white/5"
                    }`}
                >
                    {genre}
                </button>
            ))}
        </div>

        {/* CONTENT GRID */}
        {loading ? (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        ) : filteredSongs.length === 0 ? (
            <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5 mx-auto max-w-2xl backdrop-blur-sm">
                <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-300 mb-2">No Music Found</h3>
                <p className="text-gray-500">Try adjusting your search or come back later for new drops.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredSongs.map((song) => (
              <div 
                key={song.id} 
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 backdrop-blur-md"
              >
                {/* ALBUM ART PLACEHOLDER */}
                <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 relative p-6 flex items-center justify-center group-hover:scale-105 transition duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <Music className="w-20 h-20 text-gray-700 group-hover:text-purple-500/50 transition duration-500" />
                    
                    {/* PLAY BUTTON OVERLAY */}
                    <div className="absolute bottom-4 right-4 bg-purple-500 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <Play className="w-5 h-5 fill-current" />
                    </div>
                </div>

                {/* CARD BODY */}
                <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-1 truncate group-hover:text-purple-400 transition">{song.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{song.artist}</p>
                    
                    <div className="flex items-center justify-between mt-4">
                         <div className="flex flex-col">
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Price</span>
                            <span className="text-sm font-semibold text-white">View Details</span> 
                         </div>

                        <a 
                            href={`/song/${song.id}`}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition border border-white/10"
                        >
                          Details <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
              </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
