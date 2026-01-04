import React, { useEffect, useState } from "react";
import { CONTRACTS } from "../config/contracts";
import { ethers } from "ethers";
import {
  Music, TrendingUp, DollarSign, Wallet,
  ArrowUpRight, ArrowDownRight
} from "lucide-react";

import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";



export default function Portfolio() {
  const [account, setAccount] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Metamask tidak ditemukan");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };

  useEffect(() => {
    async function checkWallet() {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    }
    checkWallet();
  }, []);

  const loadPortfolio = async () => {
    try {
        if (!window.ethereum || !account) return;
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        const nftContract = new ethers.Contract(
          CONTRACTS.musicIPNFT.address,
          CONTRACTS.musicIPNFT.abi,
          provider
        );
        const total = await nftContract.tokenCounter();
        
        const myHoldings = [];

        for (let i = 1; i <= total; i++) {
            const song = await nftContract.getMusicIP(i);
            const royaltyContract = new ethers.Contract(
                song.royaltyContract,
                CONTRACTS.musicRoyalty.abi,
                provider
            );

            const balance = await royaltyContract.balanceOf(account);
            if (balance > 0) {
                 const pricePerShare = await royaltyContract.pricePerShare();
                 
                 const value = (balance * pricePerShare) / 1000000000000000000n; // ETH conversion

                 myHoldings.push({
                     id: i,
                     title: song.title,
                     artist: song.artist,
                     sharesOwned: balance.toString(),
                     currentValue: value.toString(),
                     investedAmount: "0",
                     profit: "0",
                     profitPercent: "0",
                     royaltiesEarned: "0"
                 });
            }
        }

        setHoldings(myHoldings);
        setStats({
            totalValue: "0", 
            totalInvested: "0",
            totalProfit: "0", 
            profitPercentage: "0",
            totalRoyalties: "0",
            songsOwned: myHoldings.length
        });

    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (account) loadPortfolio();
  }, [account]);

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <button
          onClick={connectWallet}
          className="px-6 py-3 bg-purple-600 rounded-lg"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loading) {
    return <p className="text-white p-10">Loading portfolio...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-6">My Portfolio</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Wallet />} label="Total Value" value={`${stats.totalValue} ETH`} />
        <StatCard icon={<TrendingUp />} label="Profit" value={`${stats.totalProfit} ETH`} />
        <StatCard icon={<DollarSign />} label="Royalties" value={`${stats.totalRoyalties} ETH`} />
        <StatCard icon={<Music />} label="Songs Owned" value={stats.songsOwned} />
      </div>

      {/* HOLDINGS */}
      <div className="space-y-4">
        {holdings.map((h) => (
          <div key={h.id} className="bg-white/5 p-5 rounded-xl border border-white/10">
            <h3 className="text-xl font-bold">{h.title}</h3>
            <p className="text-gray-400">{h.artist}</p>

            <div className="grid grid-cols-4 mt-4 text-sm">
              <p>Shares: {h.sharesOwned}</p>
              <p>Invested: {h.investedAmount} ETH</p>
              <p>Value: {h.currentValue} ETH</p>
              <p className={h.profit >= 0 ? "text-green-400" : "text-red-400"}>
                {h.profit >= 0 ? "+" : ""}{h.profit} ETH ({h.profitPercent}%)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- COMPONENT ----------
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
      <div className="mb-2 text-purple-400">{icon}</div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
