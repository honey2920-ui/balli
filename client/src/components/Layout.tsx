import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAppStore } from '@/lib/store';
import { DynamicIsland } from './DynamicIsland';
import { LoginModal } from './LoginModal';
import { LogOut, Home, Trophy, UserPlus, ShieldAlert } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const [loc, setLoc] = useLocation();
  const { role, coreId, logout, bgUrl } = useAppStore();

  useEffect(() => {
    const container = document.getElementById('falling-container');
    if (!container) return;
    const emojis = ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉'];
    
    let interval = setInterval(() => {
      const el = document.createElement('div');
      el.className = 'falling-item';
      el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left = `${Math.random() * 100}vw`;
      el.style.animationDuration = `${Math.random() * 3 + 5}s`;
      container.appendChild(el);
      setTimeout(() => el.remove(), 8000);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const isStaff = role === 'admin' || role === 'core';

  return (
    <div 
      className="min-h-screen pb-24 relative overflow-hidden font-sans bg-[#0b102a] print-bg-white"
      style={bgUrl ? { backgroundImage: `url(${bgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' } : {}}
    >
      <div id="falling-container" className="fixed inset-0 pointer-events-none z-0 opacity-[0.15] print:hidden" />
      <div className="print:hidden"><DynamicIsland /></div>
      <div className="print:hidden"><LoginModal /></div>

      <div className="p-5 flex justify-between items-center relative z-10 max-w-4xl mx-auto print:hidden">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#6b5cff] to-[#9f7aea] rounded-full flex items-center justify-center font-bold text-lg shadow-[0_0_20px_rgba(107,92,255,0.4)] border-2 border-white/10">
            {role ? role.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <p className="text-[10px] text-[#b0b0cc] uppercase tracking-wider font-semibold mb-0.5">Signed in as</p>
            <p className="font-bold text-base tracking-wide">
              {role === 'admin' ? 'ADMIN MASTER' : role === 'core' ? `CORE [${coreId}]` : 'STUDENT GUEST'}
            </p>
          </div>
        </div>
        {role && (
          <button onClick={logout} className="bg-white/5 border border-white/10 p-3 rounded-2xl hover:bg-white/10 transition-colors text-white/70 hover:text-white">
            <LogOut size={20} />
          </button>
        )}
      </div>

      <main className="relative z-10 max-w-4xl mx-auto p-4">
        {children}
      </main>

      {role && (
        <nav className="fixed bottom-0 left-0 w-full h-[84px] bg-[#12163f]/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center z-50 px-4 pb-safe print:hidden">
          <NavItem icon={<Home size={22} />} label="Home" active={loc === '/'} onClick={() => setLoc('/')} />
          <NavItem icon={<Trophy size={22} />} label="Events" active={loc === '/events'} onClick={() => setLoc('/events')} />
          <NavItem icon={<UserPlus size={22} />} label="Join" active={loc === '/join'} onClick={() => setLoc('/join')} />
          {isStaff && (
            <NavItem icon={<ShieldAlert size={22} />} label="Admin" active={loc === '/admin'} onClick={() => setLoc('/admin')} />
          )}
        </nav>
      )}
      
      <div className="relative z-10 text-center py-12 text-[10px] text-[#b0b0cc] opacity-40 font-mono tracking-widest leading-relaxed print:hidden">
        DEVELOPER: BALJINDER SINGH <br /> © 2026 GCET SPORTS CLUB<br />SUPPORT:gcetsportsequipment@gmail.com
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 px-4 py-2 rounded-2xl ${
        active ? 'text-[#6b5cff] -translate-y-2' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
      }`}
    >
      <div className={`${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(107,92,255,0.8)]' : ''} transition-all`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </div>
  );
}
