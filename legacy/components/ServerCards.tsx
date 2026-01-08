
import React from 'react';
import { HelpCircle, Users } from 'lucide-react';
import { SERVERS } from '../constants';

const ServerCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
      {SERVERS.map((server) => (
        <div key={server.id} className="relative h-64 rounded-[1.5rem] overflow-hidden group cursor-pointer">
          <img 
            src={server.image} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            alt={server.name}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="absolute inset-0 p-6 flex flex-col justify-between">
            <div className="flex justify-end">
               <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white/40 hover:text-white transition-colors">
                  <HelpCircle size={16} />
               </div>
            </div>
            
            <div>
               <h3 className="text-xl font-black font-heading text-white mb-1 uppercase tracking-tighter">{server.name}</h3>
               <div className="flex items-center text-green-400 space-x-2">
                  <Users size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">{server.players} игроков</span>
               </div>
            </div>
          </div>
          
          {/* Progress bar at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10">
             <div 
               className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
               style={{ width: `${(server.players / server.max) * 100}%` }}
             ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServerCards;
