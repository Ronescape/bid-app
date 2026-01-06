import { Card } from "../ui/card";
import { BiddingItem } from "../../data/gameData";
import { Badge } from "../ui/badge";
import { Clock, Coins, Flame, Users } from "lucide-react";
import { Button } from "../ui/button";
import { getTimeRemaining, getTimeRemainingWithSeconds, getTimeUntilStart, getTimeUntilStartWithSeconds } from "./utils/dateFormatters";
import { useEffect, useState } from "react";

interface Props {
  item: BiddingItem;
  onSelect: (item: BiddingItem) => void;
}

export function BidCard({ item, onSelect }: Props) {
  const [timeDisplay, setTimeDisplay] = useState('');
  
  useEffect(() => {
    const updateTime = () => {
      if (item.status_label === "Upcoming") {
        setTimeDisplay(getTimeRemainingWithSeconds(item.startDate));
      } else if (item.status_label === "Live") {
        setTimeDisplay(getTimeRemainingWithSeconds(item.endDate));
      } else {
        setTimeDisplay("Ended");
      }
    };
    
    updateTime();
    
    if (item.status_label === "Live" || item.status_label === "Upcoming") {
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [item.startDate, item.endDate, item.status_label]);
  
  return (
    <Card className="group overflow-hidden hover:shadow-2xl hover:shadow-red-500/70 transition-all cursor-pointer bg-slate-800/30 backdrop-blur-sm border-slate-700/50 hover:border-purple-500/50" onClick={() => onSelect(item)}>
      <div className="relative overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute top-2 right-2">
          {item.status_label === "Live" && (
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30 backdrop-blur-sm shadow-xl shadow-red-500/50 animate-pulse">
              <Flame className="w-3 h-3 mr-1" />
              LIVE
            </Badge>
          )}
          {item.status_label === "Upcoming" && <Badge className="bg-blue-500 text-white shadow-xl shadow-blue-500/50">UPCOMING</Badge>}
          {item.status_label === "Closed" && <Badge className="bg-slate-800/50 text-slate-400 backdrop-blur-sm border-slate-700/30">ENDED</Badge>}
        </div>
        {item.pointsCost && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-purple-600 text-white border-0 shadow-xl shadow-purple-500/50">
              <Coins className="w-3 h-3 mr-1" />
              {item.pointsCost} Points
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="line-clamp-1 text-white">{item.title}</h3>
          <p className="text-sm text-slate-400 line-clamp-1">{item.description}</p>
        </div>

        {item.status_label !== "Upcoming" && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-slate-400">Current Bid:</span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">${item.currentBid}</span>
          </div>
        )}

        {item.status_label === "Upcoming" && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-slate-400">Starting Bid:</span>
            <span className="text-white">${item.startingBid}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-slate-400">
              <Users className="w-4 h-4" />
              {item.bidders}
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-4 h-4" />
               {timeDisplay}
            </div>
          </div>
        </div>
         
        <Button
          className={`w-full transition-all shadow-xl border-0 ${item.status_label === "Live" ? "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:shadow-purple-500/70" : item.status_label === "Upcoming" ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-purple-500/50" : "bg-slate-800/50 text-slate-400"}`}
          onClick={(e: any) => {
            e.stopPropagation();
            onSelect(item);
          }}
          disabled={item.status_label === "Closed"}>
          {item.status_label === "Live" && "Place Bid"}
          {item.status_label === "Upcoming" && "View Details"}
          {item.status_label === "Closed" && "Auction Ended"}
        </Button>
      </div>
    </Card>
  );
}
