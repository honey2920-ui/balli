import React, { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Plus, Trash2, Wallet, TrendingDown, Package, ShoppingCart, ExternalLink, Upload, Download, CreditCard } from 'lucide-react';

export default function Join() {
  const { role, coreCreds, coreId, expenses, addExpense, deleteExpense, equipment, addEquipment, deleteEquipment } = useAppStore();
  const [activeTab, setActiveTab] = useState<'registration' | 'attendance' | 'budget' | 'equipment'>('registration');

  const power = role === 'core' && coreId ? coreCreds[coreId]?.power : null;
  const isMaster = role === 'admin' || power === 'master';
  
  // BASIC, CLASSIC, MASTER, and ADMIN can edit Registration, Attendance
  const canEditReg = isMaster || power === 'basic' || power === 'classic';
  // ONLY CLASSIC, MASTER, and ADMIN can edit Budget, Equipment
  const canEditBudget = isMaster || power === 'classic';
  const isStaff = role === 'admin' || role === 'core';

  const excelLink = "https://onedrive.live.com/view.aspx?resid=9876543210!123";

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500 pb-20">
      {isStaff && (
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md overflow-x-auto scrollbar-hide no-print">
          <TabButton label="Registration" active={activeTab === 'registration'} onClick={() => setActiveTab('registration')} />
          <TabButton label="Attendance" active={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
          <TabButton label="Budget" active={activeTab === 'budget'} onClick={() => setActiveTab('budget')} />
          <TabButton label="Equipment" active={activeTab === 'equipment'} onClick={() => setActiveTab('equipment')} />
        </div>
      )}

      {activeTab === 'registration' && <FormView title="Registration Form" actionLabel="Submit Registration" canEdit={canEditReg} showUpload={true} isRegistration={true} />}
      
      {isStaff && (
        <>
          {activeTab === 'attendance' && <FormView title="Attendance Form" actionLabel="Mark Attendance" canEdit={canEditReg} showUpload={false} isRegistration={false} />}
          {activeTab === 'budget' && <BudgetView expenses={expenses} addExpense={addExpense} deleteExpense={deleteExpense} canEdit={canEditBudget} excelLink={excelLink} />}
          {activeTab === 'equipment' && <EquipmentView equipment={equipment} addEquipment={addEquipment} deleteEquipment={deleteEquipment} canEdit={canEditBudget} excelLink={excelLink} />}
        </>
      )}
    </div>
  );
}

function TabButton({ label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all duration-300 ${
        active ? 'bg-gradient-to-r from-[#6b5cff] to-[#8073ff] text-white shadow-lg' : 'text-white/40 hover:text-white/80'
      }`}
    >
      {label}
    </button>
  );
}

function FormView({ title, actionLabel, canEdit, showUpload, isRegistration }: any) {
  const { setIslandMessage, formPublished, setFormPublished, attendanceFormPublished, setAttendanceFormPublished, events, addRegistration, registrations, deleteRegistration } = useAppStore();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Print options
  const [printIds, setPrintIds] = useState<string>('');
  
  // Edit options
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEvent, setEditEvent] = useState('');
  const [editRollNo, setEditRollNo] = useState('');
  const [editMobile, setEditMobile] = useState('');
  const [editYear, setEditYear] = useState('');
  const [editSem, setEditSem] = useState('');
  const [editEngType, setEditEngType] = useState('');
  const [editPhoto, setEditPhoto] = useState<string | null>(null);
  
  const { updateRegistration } = useAppStore();

  const handleEditClick = (r: any) => {
    setEditingId(r.id);
    setEditName(r.name);
    setEditEvent(r.event);
    setEditRollNo(r.rollNo);
    setEditMobile(r.mobile);
    setEditYear(r.year);
    setEditSem(r.sem);
    setEditEngType(r.engType);
    setEditPhoto(r.photo || null);
  };

  const handleSaveEdit = () => {
    if (editingId) {
      updateRegistration(editingId, {
        name: editName,
        event: editEvent,
        rollNo: editRollNo,
        mobile: editMobile,
        year: editYear,
        sem: editSem,
        engType: editEngType,
        photo: editPhoto
      });
      setEditingId(null);
      setIslandMessage('Registration updated');
    }
  };
  
  const isPublished = isRegistration ? formPublished : attendanceFormPublished;
  const togglePublished = () => {
    if (isRegistration) setFormPublished(!formPublished);
    else setAttendanceFormPublished(!attendanceFormPublished);
  };
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [mobile, setMobile] = useState('');
  const [engType, setEngType] = useState('');
  const [year, setYear] = useState('');
  const [event, setEvent] = useState('');
  const [sem, setSem] = useState('');
  
  const handleSubmit = () => {
    if (!name || !rollNo || !event) {
      alert("Name, Roll Number and Event are required");
      return;
    }
    
    if (isRegistration) {
      addRegistration({ name, email, rollNo, mobile, engType, year, event, sem, photo: previewUrl });
      setName(''); setEmail(''); setRollNo(''); setMobile(''); setEngType(''); setYear(''); setEvent(''); setSem(''); setPreviewUrl(null);
    } else {
      setIslandMessage(`${title} data saved`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const printIDCards = () => {
    // Basic logic to print, hide others handled by CSS
    window.print();
  };

  const currentRegistrations = printIds.trim() 
    ? registrations.filter((r, index) => {
        const terms = printIds.split(',').map(s => s.trim().toLowerCase());
        return terms.includes(r.id.toLowerCase()) || 
               terms.includes(r.rollNo.toLowerCase()) || 
               terms.includes(String(index + 1));
      })
    : registrations;

  const getPrintSizeClass = () => {
    if (currentRegistrations.length === 1) return 'id-card-single';
    if (currentRegistrations.length <= 4) return 'id-card-standard';
    return 'id-card-license';
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex justify-between items-center px-1 no-print">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {canEdit && (
          <button 
            onClick={togglePublished} 
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${isPublished ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-[#10b981] hover:bg-[#0da06f] text-white'}`}
          >
            {isPublished ? 'Unpublish' : 'Publish'}
          </button>
        )}
      </div>

      <div className="no-print">
      {!isPublished ? (
        <div className="bg-[#1e1e3f]/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-12 text-center shadow-2xl">
          <div className="text-6xl mb-6">⏳</div>
          <h3 className="text-2xl font-bold text-white mb-2">We will be right soon</h3>
          <p className="text-white/50">with a new event</p>
        </div>
      ) : (
        <div className="bg-[#1e1e3f]/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 space-y-6 shadow-2xl">
          {showUpload && (
            <div className="flex flex-col items-center gap-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-3xl bg-black/30 border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#6b5cff]/50 hover:bg-black/40 transition-all overflow-hidden relative group"
              >
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Upload className="text-white/20 group-hover:text-[#6b5cff] transition-colors" size={32} />
                    <span className="text-[10px] font-bold text-white/20 mt-2 uppercase tracking-widest">Upload Photo</span>
                  </>
                )}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Plus className="text-white" size={24} />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Passport size photo required</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input placeholder="Full Name" value={name} onChange={(e: any) => setName(e.target.value)} />
            <Input placeholder="Email ID" value={email} onChange={(e: any) => setEmail(e.target.value)} />
            <Input placeholder="Roll Number" value={rollNo} onChange={(e: any) => setRollNo(e.target.value)} />
            <Input placeholder="Mobile Number" value={mobile} onChange={(e: any) => setMobile(e.target.value)} />
            <Select options={["B.Tech", "Diploma"]} placeholder="Engineering Type" value={engType} onChange={(e: any) => setEngType(e.target.value)} />
            <Select options={["1", "2", "3", "4"]} placeholder="Year" value={year} onChange={(e: any) => setYear(e.target.value)} />
            <Select options={events.map(e => e.name)} placeholder="Select Event" value={event} onChange={(e: any) => setEvent(e.target.value)} />
            <Select options={["1", "2", "3", "4", "5", "6", "7", "8"]} placeholder="Select Semester" value={sem} onChange={(e: any) => setSem(e.target.value)} />
          </div>
          <button 
            onClick={handleSubmit}
            className="w-full bg-[#6b5cff] hover:bg-[#8073ff] text-white py-4 rounded-2xl font-bold text-lg transition-all mt-4 shadow-lg active:scale-95"
          >
            {actionLabel}
          </button>
        </div>
      )}
      </div>

      {/* Print view for Attendance */}
      {!isRegistration && (
        <div className="print-only">
          <h2 className="print-header">Attendance Report - GCET Sports Club</h2>
          <p style={{marginBottom: '20px', color: '#666'}}>Generated on: {new Date().toLocaleDateString()}</p>
          <table className="print-table">
             <thead>
               <tr>
                 <th>No.</th>
                 <th>Name</th>
                 <th>Roll No</th>
                 <th>Event</th>
                 <th>Attendance</th>
               </tr>
             </thead>
             <tbody>
                {/* Mock data for attendance sheet */}
                {registrations.length > 0 ? registrations.map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td>{r.name}</td>
                    <td>{r.rollNo}</td>
                    <td>{r.event}</td>
                    <td style={{width: '100px'}}></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>No registrations found to generate attendance sheet.</td>
                  </tr>
                )}
             </tbody>
          </table>
        </div>
      )}

      {isRegistration && canEdit && (
        <div className="mt-12 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-1 gap-4 no-print">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <CreditCard className="text-[#fca311]" /> Registrations & ID Cards
            </h3>
            {registrations.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="ID, Roll No, or Index (e.g. 1, 2, 5)" 
                  value={printIds}
                  onChange={(e) => setPrintIds(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm focus:border-[#6b5cff] outline-none placeholder:text-white/40 flex-1 md:flex-none min-w-[200px]"
                />
                <button 
                  onClick={printIDCards}
                  className="flex items-center justify-center gap-2 bg-[#6b5cff] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#8073ff] transition-all shadow-lg active:scale-95 whitespace-nowrap flex-1 md:flex-none"
                >
                  <Download size={16} /> Print {printIds.trim() ? 'Selected' : 'All'}
                </button>
              </div>
            )}
          </div>
          
          {registrations.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl py-12 text-center text-white/40 font-medium no-print">
              No registrations yet.
            </div>
          ) : (
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 print:block print:w-full`}>
              {currentRegistrations.map(r => (
                <div key={r.id} className={`id-card-print bg-white/5 border border-white/20 p-6 rounded-[24px] relative group overflow-hidden ${getPrintSizeClass()}`}>
                  {editingId === r.id ? (
                    <div className="space-y-3 relative z-10 no-print">
                      <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-black/40 border border-[#6b5cff]/30 rounded-lg px-3 py-2 text-sm text-white" placeholder="Name" />
                      <input type="text" value={editEvent} onChange={e => setEditEvent(e.target.value)} className="w-full bg-black/40 border border-[#6b5cff]/30 rounded-lg px-3 py-2 text-sm text-white" placeholder="Event" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={editRollNo} onChange={e => setEditRollNo(e.target.value)} className="w-full bg-black/40 border border-[#6b5cff]/30 rounded-lg px-3 py-2 text-sm text-white" placeholder="Roll No" />
                        <input type="text" value={editMobile} onChange={e => setEditMobile(e.target.value)} className="w-full bg-black/40 border border-[#6b5cff]/30 rounded-lg px-3 py-2 text-sm text-white" placeholder="Mobile" />
                        <input type="text" value={editYear} onChange={e => setEditYear(e.target.value)} className="w-full bg-black/40 border border-[#6b5cff]/30 rounded-lg px-3 py-2 text-sm text-white" placeholder="Year" />
                        <input type="text" value={editSem} onChange={e => setEditSem(e.target.value)} className="w-full bg-black/40 border border-[#6b5cff]/30 rounded-lg px-3 py-2 text-sm text-white" placeholder="Sem" />
                        <input type="text" value={editEngType} onChange={e => setEditEngType(e.target.value)} className="w-full bg-black/40 border border-[#6b5cff]/30 rounded-lg px-3 py-2 text-sm text-white" placeholder="Type" />
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={handleSaveEdit} className="flex-1 bg-[#10b981] hover:bg-[#0da06f] text-white py-2 rounded-lg font-bold text-sm">Save</button>
                        <button onClick={() => setEditingId(null)} className="flex-1 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white py-2 rounded-lg font-bold text-sm">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* ID Card Design */}
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="text-6xl">⚽</span>
                      </div>
                      
                      <div className="flex gap-5 relative z-10">
                        <div className="w-24 h-32 rounded-xl bg-black/40 border border-white/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                          {r.photo ? (
                            <img src={r.photo} alt={r.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-4xl text-white/20">👤</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-extrabold text-xl mb-1 text-[#6b5cff] uppercase tracking-wide id-card-text">{r.name}</h4>
                          <p className="text-xs font-bold text-[#fca311] mb-3 tracking-widest uppercase id-card-text">{r.event}</p>
                          
                          <div className="grid grid-cols-2 gap-y-2 text-xs">
                            <div>
                              <span className="text-white/40 uppercase tracking-wider text-[9px] block id-card-label">Roll No</span>
                              <span className="font-mono font-bold id-card-text">{r.rollNo}</span>
                            </div>
                            <div>
                              <span className="text-white/40 uppercase tracking-wider text-[9px] block id-card-label">Mobile</span>
                              <span className="font-mono font-bold id-card-text">{r.mobile}</span>
                            </div>
                            <div>
                              <span className="text-white/40 uppercase tracking-wider text-[9px] block id-card-label">Year/Sem</span>
                              <span className="font-bold id-card-text">{r.year} Yr / {r.sem} Sem</span>
                            </div>
                            <div>
                              <span className="text-white/40 uppercase tracking-wider text-[9px] block id-card-label">Type</span>
                              <span className="font-bold id-card-text">{r.engType}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-white/30 id-card-label">ID: {r.id.toUpperCase()}</span>
                        <span className="text-[10px] font-bold text-white/50 tracking-widest id-card-label">GCET SPORTS CLUB</span>
                      </div>
    
                      <div className="no-print absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setPrintIds(r.id);
                            setTimeout(() => window.print(), 100);
                          }}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white"
                          title="Download PDF"
                        >
                          <Download size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditClick(r)}
                          className="p-2 bg-[#fca311]/20 text-[#fca311] rounded-lg hover:bg-[#fca311] hover:text-white"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button 
                          onClick={() => deleteRegistration(r.id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {/* Print view for Attendance */}
      {!isRegistration && (
        <div className="print-only">
          <h2 className="print-header">Attendance Report - GCET Sports Club</h2>
          <p style={{marginBottom: '20px', color: '#666'}}>Generated on: {new Date().toLocaleDateString()}</p>
          <table className="print-table">
             <thead>
               <tr>
                 <th>No.</th>
                 <th>Name</th>
                 <th>Roll No</th>
                 <th>Event</th>
                 <th>Attendance</th>
               </tr>
             </thead>
             <tbody>
                {/* Mock data for attendance sheet */}
                {registrations.length > 0 ? registrations.map((r, i) => (
                  <tr key={r.id}>
                    <td>{i + 1}</td>
                    <td>{r.name}</td>
                    <td>{r.rollNo}</td>
                    <td>{r.event}</td>
                    <td style={{width: '100px'}}></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>No registrations found to generate attendance sheet.</td>
                  </tr>
                )}
             </tbody>
          </table>
        </div>
      )}

      {/* Attendance specific view for staff */}
      {!isRegistration && canEdit && (
        <div className="mt-12">
          <div className="flex justify-between items-center px-1 mb-6 no-print">
            <h3 className="text-xl font-bold">Attendance Sheet</h3>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-[#6b5cff] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#8073ff] transition-all shadow-lg active:scale-95"
            >
              <Download size={16} /> Download PDF
            </button>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-[28px] p-6 flex flex-col md:flex-row items-start md:items-center justify-between backdrop-blur-md no-print">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
               <div className="p-3 bg-green-500/10 rounded-2xl text-green-400">
                  <FileSpreadsheet size={24} />
               </div>
               <div>
                 <h4 className="font-bold text-lg">Live Attendance Excel</h4>
                 <p className="text-xs text-white/30 font-mono tracking-wider">attendance_2026.xlsx</p>
               </div>
            </div>
            <a 
              href="https://onedrive.live.com/view.aspx?resid=9876543210!123" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#10b981] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#0da270] transition-all active:scale-95 shadow-lg shadow-green-500/20"
            >
              Open Live Excel <ExternalLink size={14} />
            </a>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function BudgetView({ expenses, addExpense, deleteExpense, canEdit, excelLink }: any) {
  const totalAllotted = expenses.filter(e => e.type === 'allotted').reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);

  const handleAdd = (type: 'allotted' | 'expense') => {
    const item = prompt(`Enter ${type} item name:`);
    if (!item) return;
    const amount = parseFloat(prompt("Enter amount:") || "0");
    if (isNaN(amount)) return;
    addExpense({ type, item, amount, date: new Date().toLocaleDateString() });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center px-1 no-print">
        <h2 className="text-2xl font-bold tracking-tight">Budget Management</h2>
        <a href={excelLink} target="_blank" rel="noopener noreferrer" className="text-green-400 p-2 hover:bg-green-400/10 rounded-xl transition-colors">
          <FileSpreadsheet size={24} />
        </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 no-print">
        <BudgetStat label="Total Allotted" amount={totalAllotted} color="text-green-400" />
        <BudgetStat label="Total Expense" amount={totalExpense} color="text-red-400" />
        <div className="md:col-span-2">
          <BudgetStat 
            label="Remaining Balance" 
            amount={totalAllotted - totalExpense} 
            color={totalAllotted - totalExpense >= 0 ? "text-blue-400" : "text-red-500"} 
          />
        </div>
      </div>

      {canEdit && (
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md no-print">
          <h4 className="font-bold mb-6 text-white/70 uppercase tracking-widest text-sm">Add Entry</h4>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleAdd('allotted')} className="flex items-center justify-center gap-2 bg-[#10b981]/10 text-[#10b981] py-4 rounded-2xl font-bold border border-[#10b981]/20 hover:bg-[#10b981]/20 transition-all active:scale-95">
              <Plus size={20} /> Add Allotted
            </button>
            <button onClick={() => handleAdd('expense')} className="flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-4 rounded-2xl font-bold border border-red-500/20 hover:bg-red-500/20 transition-all active:scale-95">
              <Plus size={20} /> Add Expense
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center px-1 no-print mt-6 mb-2">
        <h4 className="font-bold text-white/50 tracking-widest uppercase text-sm">Recent Entries</h4>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors"
        >
          <Download size={14} /> PDF
        </button>
      </div>

      <div className="space-y-3 no-print">
        {expenses.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl py-8 text-center text-white/20 font-medium backdrop-blur-sm">No entries yet.</div>
        ) : (
          expenses.map(e => (
            <div key={e.id} className="bg-black/40 border border-white/5 p-5 rounded-2xl flex items-center justify-between group hover:border-[#6b5cff]/30 transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${e.type === 'allotted' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {e.type === 'allotted' ? <Wallet size={20} /> : <TrendingDown size={20} />}
                </div>
                <div>
                  <p className="font-bold">{e.item}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">{e.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <p className={`font-bold text-lg ${e.type === 'allotted' ? 'text-green-400' : 'text-red-400'}`}>
                  {e.type === 'allotted' ? '+' : '-'} ₹{e.amount}
                </p>
                {canEdit && (
                  <button onClick={() => deleteExpense(e.id)} className="text-white/20 hover:text-red-400 transition-colors p-2 active:scale-90">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Print View for Budget */}
      <div className="print-only">
        <h2 className="print-header">Budget Report - GCET Sports Club</h2>
        
        <table className="print-table">
          <thead>
            <tr>
              <th colSpan={2}>Summary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Total Allotted</strong></td>
              <td style={{ color: 'green' }}>+ ₹{totalAllotted.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Total Expense</strong></td>
              <td style={{ color: 'red' }}>- ₹{totalExpense.toLocaleString()}</td>
            </tr>
            <tr>
              <td><strong>Remaining Balance</strong></td>
              <td style={{ fontWeight: 'bold' }}>₹{(totalAllotted - totalExpense).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <table className="print-table mt-8">
          <thead>
            <tr>
              <th>Date</th>
              <th>Item / Description</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id}>
                <td>{e.date}</td>
                <td>{e.item}</td>
                <td>{e.type === 'allotted' ? 'Allotted' : 'Expense'}</td>
                <td style={{ color: e.type === 'allotted' ? 'green' : 'red' }}>
                  {e.type === 'allotted' ? '+' : '-'} ₹{e.amount}
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr><td colSpan={4} style={{textAlign: 'center'}}>No entries recorded</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function EquipmentView({ equipment, addEquipment, deleteEquipment, canEdit, excelLink }: any) {
  const handleAdd = (type: 'available' | 'wanted') => {
    const name = prompt(`Enter ${type} item name:`);
    if (!name) return;
    const qty = parseInt(prompt("Enter quantity:") || "0");
    if (isNaN(qty)) return;
    addEquipment({ type, name, qty });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex justify-between items-center px-1 no-print">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">Equipment List</h2>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors ml-4"
          >
            <Download size={14} /> PDF
          </button>
        </div>
        <a href={excelLink} target="_blank" rel="noopener noreferrer" className="text-green-400 p-2 hover:bg-green-400/10 rounded-xl transition-colors">
          <FileSpreadsheet size={24} />
        </a>
      </div>

      <div className="no-print space-y-8">
        <EquipmentSection 
          title="Available Items" 
          items={equipment.filter((e: any) => e.type === 'available')} 
          icon={<Package size={20} className="text-green-400" />}
          onAdd={() => handleAdd('available')}
          onDelete={deleteEquipment}
          canEdit={canEdit}
          dotColor="bg-green-400"
        />

        <EquipmentSection 
          title="Wanted List" 
          items={equipment.filter((e: any) => e.type === 'wanted')} 
          icon={<ShoppingCart size={20} className="text-[#fca311]" />}
          onAdd={() => handleAdd('wanted')}
          onDelete={deleteEquipment}
          canEdit={canEdit}
          dotColor="bg-[#fca311]"
        />
      </div>

      {/* Print View for Equipment */}
      <div className="print-only">
        <h2 className="print-header">Equipment List - GCET Sports Club</h2>
        
        <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '10px'}}>Available Items</h3>
        <table className="print-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {equipment.filter((e: any) => e.type === 'available').map((item: any) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
              </tr>
            ))}
            {equipment.filter((e: any) => e.type === 'available').length === 0 && (
              <tr><td colSpan={2} style={{textAlign: 'center'}}>No items available</td></tr>
            )}
          </tbody>
        </table>

        <h3 style={{fontSize: '18px', fontWeight: 'bold', margin: '20px 0 10px'}}>Wanted / Requested Items</h3>
        <table className="print-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity Needed</th>
            </tr>
          </thead>
          <tbody>
            {equipment.filter((e: any) => e.type === 'wanted').map((item: any) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
              </tr>
            ))}
            {equipment.filter((e: any) => e.type === 'wanted').length === 0 && (
              <tr><td colSpan={2} style={{textAlign: 'center'}}>No items requested</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

function EquipmentSection({ title, items, onAdd, onDelete, canEdit, dotColor }: any) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        <h4 className="font-bold flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full ${dotColor} shadow-[0_0_8px_currentColor]`}></span>
          {title}
        </h4>
        {canEdit && (
          <button onClick={onAdd} className="bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-green-500/20 transition-all active:scale-95">
            + Add {title.split(' ')[0]}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item: any) => (
          <div key={item.id} className={`bg-gradient-to-br from-black/60 to-black/40 border border-white/10 p-5 rounded-[24px] flex items-center justify-between group transition-all backdrop-blur-md shadow-lg ${
            dotColor === 'bg-green-400' ? 'hover:border-green-500/50 hover:shadow-[0_0_20px_rgba(74,222,128,0.15)]' : 'hover:border-[#fca311]/50 hover:shadow-[0_0_20px_rgba(252,163,17,0.15)]'
          }`}>
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/5 ${
                dotColor === 'bg-green-400' ? 'bg-gradient-to-br from-green-500/20 to-emerald-600/10' : 'bg-gradient-to-br from-[#fca311]/20 to-orange-500/10'
              } group-hover:scale-110 transition-transform duration-300`}>
                {getEmoji(item.name)}
              </div>
              <div>
                <p className="font-bold text-lg text-white mb-1">{item.name}</p>
                <div className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  dotColor === 'bg-green-400' ? 'bg-green-500/10 text-green-400' : 'bg-[#fca311]/10 text-[#fca311]'
                }`}>
                  Qty: {item.qty}
                </div>
              </div>
            </div>
            {canEdit && (
              <button 
                onClick={() => onDelete(item.id)} 
                className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-xl transition-all active:scale-90 opacity-0 group-hover:opacity-100 border border-red-500/20"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BudgetStat({ label, amount, color }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-xl shadow-xl">
      <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-3">{label}</p>
      <h3 className={`text-4xl font-extrabold ${color} tracking-tighter`}>₹{amount.toLocaleString()}</h3>
    </div>
  );
}

function Input({ placeholder, value, onChange }: any) {
  return <input type="text" placeholder={placeholder} value={value} onChange={onChange} className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#6b5cff] outline-none transition-colors placeholder:text-white/20" />;
}

function Select({ options, placeholder, value, onChange }: any) {
  return (
    <select value={value} onChange={onChange} className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-[#6b5cff] outline-none appearance-none transition-colors">
      <option value="" className="bg-[#1e1e3f]">{placeholder}</option>
      {options.map((o: any) => <option key={o} value={o} className="bg-[#1e1e3f]">{o}</option>)}
    </select>
  );
}

function getEmoji(name: string) {
  const n = name.toLowerCase();
  // Sports
  if (n.includes('football') || n.includes('soccer')) return '⚽';
  if (n.includes('bat') || n.includes('cricket')) return '🏏';
  if (n.includes('basketball')) return '🏀';
  if (n.includes('volleyball')) return '🏐';
  if (n.includes('tennis')) return '🎾';
  if (n.includes('shuttle') || n.includes('badminton')) return '🏸';
  if (n.includes('baseball')) return '⚾';
  if (n.includes('softball')) return '🥎';
  if (n.includes('rugby')) return '🏉';
  if (n.includes('frisbee')) return '🥏';
  if (n.includes('billiards') || n.includes('pool')) return '🎱';
  if (n.includes('yoyo')) return '🪀';
  if (n.includes('ping pong') || n.includes('table tennis')) return '🏓';
  if (n.includes('ice hockey')) return '🏒';
  if (n.includes('field hockey')) return '🏑';
  if (n.includes('lacrosse')) return '🥍';
  if (n.includes('goal') || n.includes('net')) return '🥅';
  if (n.includes('golf')) return '⛳';
  if (n.includes('archery') || n.includes('bow')) return '🏹';
  if (n.includes('fishing')) return '🎣';
  if (n.includes('boxing')) return '🥊';
  if (n.includes('martial arts') || n.includes('karate') || n.includes('judo')) return '🥋';
  if (n.includes('running') || n.includes('track') || n.includes('jersey')) return '🎽';
  if (n.includes('skate')) return '🛹';
  if (n.includes('sled')) return '🛷';
  if (n.includes('skat')) return '⛸';
  if (n.includes('ski')) return '🎿';
  if (n.includes('snowboard')) return '🏂';
  if (n.includes('weight') || n.includes('gym')) return '🏋';
  if (n.includes('wrestl')) return '🤼';
  if (n.includes('gymnast')) return '🤸';
  if (n.includes('fenc')) return '🤺';
  if (n.includes('yoga')) return '🧘';
  if (n.includes('surf')) return '🏄';
  if (n.includes('swim')) return '🏊';
  if (n.includes('water polo')) return '🤽';
  if (n.includes('rowing') || n.includes('boat')) return '🚣';
  if (n.includes('climb')) return '🧗';
  if (n.includes('bike') || n.includes('cycle')) return '🚴';
  
  // Generic
  if (n.includes('cone')) return '🔺';
  if (n.includes('whistle')) return '😙';
  if (n.includes('stopwatch')) return '⏱';
  if (n.includes('bottle') || n.includes('water')) return '🚰';
  if (n.includes('bag')) return '🎒';
  if (n.includes('shoe')) return '👟';
  if (n.includes('pump')) return '⛽';
  if (n.includes('kit') || n.includes('med')) return '🧰';

  return '🏆'; 
}