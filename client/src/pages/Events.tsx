import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Trophy, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Events() {
  const { role, coreCreds, coreId } = useAppStore();
  const [events, setEvents] = useState([
    { id: 'ev1', name: 'Inter-College Cricket', date: '2026-03-15', description: 'Annual cricket tournament with neighboring colleges.', img: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800' }
  ]);

  const isMaster = role === 'admin' || (role === 'core' && coreId && coreCreds[coreId]?.power === 'admin_level');
  const canEdit = isMaster || role === 'core';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold tracking-tight px-1">Event Gallery</h2>

      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-wide px-1">Portals</h3>
        <div className="grid grid-cols-2 gap-4">
          <PortalCard title="Khelo India" icon="🏆" />
          <PortalCard title="Khel Mahakumbh" icon="🏅" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-bold tracking-wide">Events</h3>
          {canEdit && (
            <button className="bg-[#10b981] text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#0da06f] transition-all">
              <Plus size={18} /> Add Event
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map(e => (
            <div key={e.id} className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden group hover:border-[#6b5cff]/30 transition-all">
              <div className="relative h-48 overflow-hidden">
                <img src={e.img} alt={e.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              <div className="p-6 relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#6b5cff]" />
                  <h4 className="font-bold text-xl">{e.name}</h4>
                </div>
                <p className="text-sm text-white/50 leading-relaxed mb-6">{e.description}</p>
                <div className="flex items-center justify-between text-white/30 font-mono text-xs uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Trophy size={14} /> 2026-03-15
                  </div>
                  {canEdit && (
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-[#6b5cff] transition-all"><Edit2 size={16} /></button>
                      <button className="p-2 hover:bg-white/10 rounded-lg text-white/50 hover:text-red-400 transition-all"><Trash2 size={16} /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function PortalCard({ title, icon }: any) {
  return (
    <div className="bg-[#1e1e3f]/60 border border-white/5 p-8 rounded-[32px] text-center backdrop-blur-xl hover:bg-[#6b5cff]/10 hover:border-[#6b5cff]/20 transition-all cursor-pointer group">
      <div className="text-3xl mb-4 group-hover:scale-125 transition-transform duration-300">{icon}</div>
      <h4 className="font-bold text-lg mb-1">{title}</h4>
      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold flex items-center justify-center gap-2">
        Open portal <ExternalLink size={10} />
      </p>
    </div>
  );
}