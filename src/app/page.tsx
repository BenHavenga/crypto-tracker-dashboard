"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Moon,
  Sun,
  Star,
  TrendingUp,
  TrendingDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
  image: string;
}

export default function Dashboard() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortKey, setSortKey] = useState<
    "market_cap" | "price_change_percentage_24h"
  >("market_cap");

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&sparkline=true&order=market_cap_desc&per_page=100&page=1"
    )
      .then((res) => res.json())
      .then((data) => setCoins(data))
      .catch((err) => console.error("Failed to fetch coins:", err));
  }, []);

  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((coinId) => coinId !== id) : [...prev, id]
    );
  };

  const sortedCoins = useMemo(() => {
    const filtered = coins.filter((coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase())
    );
    const viewed = showOnlyFavorites
      ? filtered.filter((coin) => favorites.includes(coin.id))
      : filtered;
    return [...viewed].sort((a, b) => b[sortKey] - a[sortKey]);
  }, [coins, search, favorites, showOnlyFavorites, sortKey]);

  const totalMarketCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0);
  const totalVolume = coins.reduce((sum, coin) => sum + coin.total_volume, 0);

  return (
    <div
      className={
        darkMode
          ? "dark bg-neutral-950 text-white min-h-screen"
          : "bg-neutral-100 text-neutral-900 min-h-screen"
      }
    >
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
          <h1 className="text-4xl font-bold tracking-tight">
            Crypto Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <Sun className="text-yellow-500" />
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            <Moon className="text-blue-500" />
          </div>
        </div>

        {/* Summary Report */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Global Market Cap
              </p>
              <h2 className="text-2xl font-semibold mt-1">
                ${totalMarketCap.toLocaleString()}
              </h2>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                24h Volume
              </p>
              <h2 className="text-2xl font-semibold mt-1">
                ${totalVolume.toLocaleString()}
              </h2>
            </CardContent>
          </Card>
          <Card className="bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Coins Tracked
              </p>
              <h2 className="text-2xl font-semibold mt-1">{coins.length}</h2>
            </CardContent>
          </Card>
        </div>

        {/* Filter & Sort Panel */}
        <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-lg p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center w-full md:w-1/2 relative">
            <Search
              className="absolute left-3 top-2.5 text-neutral-400"
              size={18}
            />
            <Input
              placeholder="Search for a coin..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="text-neutral-500" size={16} />
              <label className="text-sm">Sort</label>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as any)}
                className="rounded border px-2 py-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 text-sm"
              >
                <option value="market_cap">Market Cap</option>
                <option value="price_change_percentage_24h">
                  24h % Change
                </option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm">Favorites</label>
              <Switch
                checked={showOnlyFavorites}
                onCheckedChange={setShowOnlyFavorites}
              />
            </div>
          </div>
        </div>

        {/* Coin Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedCoins.map((coin) => (
            <Card
              key={coin.id}
              className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="font-medium text-base truncate max-w-[150px]">
                      {coin.name}
                    </span>
                  </div>
                  <button onClick={() => toggleFavorite(coin.id)}>
                    {favorites.includes(coin.id) ? (
                      <Star className="text-yellow-400" />
                    ) : (
                      <Star className="text-neutral-400" />
                    )}
                  </button>
                </div>
                <div className="text-xl font-semibold">
                  ${coin.current_price.toLocaleString()}
                </div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  Rank #{coin.market_cap_rank} • Vol $
                  {coin.total_volume.toLocaleString()}
                </div>
                <div
                  className={`text-sm font-medium flex items-center gap-1 ${
                    coin.price_change_percentage_24h >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coin.price_change_percentage_24h >= 0 ? (
                    <TrendingUp size={16} />
                  ) : (
                    <TrendingDown size={16} />
                  )}
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </div>
                <div className="h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={coin.sparkline_in_7d.price.map((p, i) => ({
                        i,
                        p,
                      }))}
                    >
                      <Line
                        type="monotone"
                        dataKey="p"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={false}
                      />
                      <XAxis dataKey="i" hide />
                      <Tooltip
                        formatter={(value: number) => `$${value.toFixed(2)}`}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
