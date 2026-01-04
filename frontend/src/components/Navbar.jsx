import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Music } from "lucide-react";

export default function Navbar({ account, onConnect, isWrongNetwork, onSwitchNetwork }) {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full bg-black/30 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <Music className="w-8 h-8 text-purple-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Melodia
            </span>
          </div>

          <div className="hidden md:flex space-x-8 text-white">
            <Link to="/" className="hover:text-purple-400 transition">Home</Link>
            <Link to="/marketplace" className="hover:text-purple-400 transition">Marketplace</Link>
            <Link to="/creator" className="hover:text-purple-400 transition">Creator Hub</Link>
            <Link to="/portfolio" className="hover:text-purple-400 transition">Portfolio</Link>
          </div>

          {account && isWrongNetwork ? (
            <button
              onClick={onSwitchNetwork}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition shadow-lg shadow-purple-500/30"
            >
              Connect to Sepolia
            </button>
          ) : (
            <button
              onClick={onConnect}
              className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:scale-105 transition shadow-lg shadow-purple-500/30"
            >
              {account
                ? account.slice(0, 6) + "..." + account.slice(-4)
                : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
