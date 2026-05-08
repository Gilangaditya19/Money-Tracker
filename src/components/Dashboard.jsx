import { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  User, Home, History,
  Plus, Minus, Target, ArrowUpCircle, ArrowDownCircle,
  LogOut, Wallet, TrendingUp, Trash2
} from 'lucide-react';

function Dashboard({ user, onLogout }) {
  const [data, setData] = useState({ balance: 0, transactions: [], goals: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [txType, setTxType] = useState('income'); // 'income' or 'expense'
  const [txAmount, setTxAmount] = useState('');
  const [txTitle, setTxTitle] = useState('');

  // Saving Goals States
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');

  const [activeTab, setActiveTab] = useState('home'); // 'home' or 'activities'

  const fetchDashboard = async () => {
    setLoading(true);
    const res = await api.getDashboard(user.user_id);
    if (res.status === 'success') {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(txAmount);
    if (!amountNum || !txTitle) return;

    // Optional category handling omitted for simplicity
    await api.addTransaction(user.user_id, txType, amountNum, txTitle, '');

    setShowModal(false);
    setTxAmount('');
    setTxTitle('');
    fetchDashboard(); // Refresh data
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!goalName || !goalTarget) return;
    await api.addGoal(user.user_id, goalName, parseFloat(goalTarget));
    setShowGoalModal(false);
    setGoalName('');
    setGoalTarget('');
    fetchDashboard();
  };

  const handleDeleteTransaction = async (txId) => {
    if (window.confirm('Hapus transaksi ini?')) {
      await api.deleteTransaction(txId);
      fetchDashboard();
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Hapus target ini?')) {
      await api.deleteGoal(goalId);
      fetchDashboard();
    }
  };

  const openModal = (type) => {
    setTxType(type);
    setShowModal(true);
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header" style={styles.sidebarHeader}>
          <div style={styles.avatar}>
            <User size={24} color="#FFFFFF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-primary)' }}>{user.username}</div>
          </div>
        </div>

        <nav className="nav" style={styles.nav}>
          <div
            className="nav-item"
            style={{ ...styles.navItem, ...(activeTab === 'home' ? styles.navItemActive : styles.navItemInactive) }}
            onClick={() => setActiveTab('home')}
          >
            <Home size={20} /> <span>Beranda</span>
          </div>
          <div
            className="nav-item"
            style={{ ...styles.navItem, ...(activeTab === 'activities' ? styles.navItemActive : styles.navItemInactive) }}
            onClick={() => setActiveTab('activities')}
          >
            <History size={20} /> <span>Aktivitas</span>
          </div>
        </nav>

        <div className="sidebar-footer" style={styles.sidebarFooter}>
          <button className="btn btn-secondary" onClick={onLogout} style={{ width: '100%', borderRadius: '24px' }}>
            <LogOut size={18} /> <span className="hide-mobile">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="panel panel-blue" style={styles.topbar}>
          <h2 className="badge-pill bg-yellow" style={{ margin: 0, fontSize: '1.2rem' }}>MONEY TRACKER</h2>
        </header>

        {/* Dashboard Content Switching */}
        {activeTab === 'home' ? (
          <div className="dashboard-grid">

            {/* Balance Card */}
            <div className="panel panel-yellow">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 className="badge-pill bg-white" style={{ fontSize: '1.2rem', margin: 0 }}>Total Saldo</h3>
              </div>
              <div className="balance-amount">
                {loading ? '...' : formatMoney(data.balance)}
              </div>
            </div>

            {/* Action Card */}
            <div className="panel panel-pink" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 className="badge-pill bg-white" style={{ fontSize: '1.2rem', margin: 0, alignSelf: 'flex-start' }}>Catat Transaksi</h3>
              <button className="btn btn-primary" onClick={() => openModal('income')} style={{ justifyContent: 'space-between', borderRadius: '24px' }}>
                Tambah Pemasukan <div className="circle-icon bg-white"><Plus size={16} /></div>
              </button>
              <button className="btn bg-white" onClick={() => openModal('expense')} style={{ justifyContent: 'space-between', borderRadius: '24px' }}>
                Catat Pengeluaran <div className="circle-icon bg-yellow"><Minus size={16} /></div>
              </button>
            </div>

            {/* Goals Section */}
            <div style={{ ...styles.goalCard, gridColumn: '1 / 2', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '500' }}>Target Pencapaian</h3>
                <button className="btn btn-outline-green" onClick={() => setShowGoalModal(true)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  <Plus size={14} /> Tambah Target
                </button>
              </div>

              {data.goals.length === 0 ? (
                <div className="panel" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  Belum ada target. Klik "Tambah Target" untuk memulai.
                </div>
              ) : (
                data.goals.map((goal, idx) => {
                  const progress = Math.min(Math.round((data.balance / goal.target_amount) * 100), 100);
                  return (
                    <div key={idx} className="panel panel-blue" style={{ marginBottom: '0.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="circle-icon bg-yellow"><Target size={20} color="#000" /></div>
                          <h3 className="badge-pill bg-white" style={{ fontSize: '1.5rem', margin: 0 }}>{goal.goal_name}</h3>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="badge-pill bg-pink" style={{ fontSize: '1rem' }}>{progress}%</span>
                          <button 
                            onClick={() => handleDeleteGoal(goal.goal_id)}
                            className="circle-icon bg-white" 
                            style={{ cursor: 'pointer', border: 'var(--border-thick)' }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-pink)'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem', padding: '0 0.5rem' }}>
                          <span>{formatMoney(data.balance)} Tersimpan</span>
                          <span>Target: {formatMoney(goal.target_amount)}</span>
                        </div>
                        <div style={styles.progressBarBg}>
                          <div style={{ ...styles.progressBarFill, width: `${progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Activity Summary Card */}
            <div className="panel panel-green activity-card-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 className="badge-pill bg-white" style={{ fontSize: '1.2rem', margin: 0 }}>Aktivitas</h3>
                <span className="badge-pill bg-yellow" style={{ fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => setActiveTab('activities')}>
                  Lihat Semua
                </span>
              </div>

              <div style={styles.activityList}>
                {loading ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>Memuat data...</div>
                ) : data.transactions.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>Belum ada transaksi.</div>
                ) : (
                  data.transactions.slice(0, 5).map((tx, idx) => (
                    <ActivityRow key={idx} tx={tx} formatMoney={formatMoney} formatDate={formatDate} onDelete={handleDeleteTransaction} />
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Full Activities Page */
          <div className="panel panel-green animate-fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="badge-pill bg-white" style={{ margin: 0 }}>Riwayat Aktivitas</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {data.transactions.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '4rem 0', fontWeight: '700' }}>
                  Tidak ada data aktivitas ditemukan.
                </div>
              ) : (
                data.transactions.map((tx, idx) => (
                  <div key={idx} className="panel bg-white" style={{ padding: '1rem', marginBottom: '0' }}>
                    <ActivityRow tx={tx} formatMoney={formatMoney} formatDate={formatDate} onDelete={handleDeleteTransaction} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Transaction Modal */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div className="panel animate-fade-in" style={styles.modalContent}>
            <h2 style={{ marginBottom: '1.5rem', color: txType === 'income' ? 'var(--neon-green)' : 'var(--neon-magenta)' }}>
              {txType === 'income' ? 'Tambah Pemasukan' : 'Catat Pengeluaran'}
            </h2>
            <form onSubmit={handleAddTransaction}>
              <div className="input-group">
                <label>Judul Transaksi</label>
                <input
                  type="text"
                  className="input-field"
                  value={txTitle}
                  onChange={(e) => setTxTitle(e.target.value)}
                  placeholder="Gaji / Makan siang..."
                  required
                />
              </div>
              <div className="input-group" style={{ marginBottom: '2rem' }}>
                <label>Nominal (Rp)</label>
                <input
                  type="number"
                  step="0.01"
                  className="input-field"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)} style={{ flex: 1, border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-primary)' }}>BATAL</button>
                <button type="submit" className={`btn ${txType === 'income' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }}>SIMPAN</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showGoalModal && (
        <div style={styles.modalOverlay}>
          <div className="panel animate-fade-in" style={styles.modalContent}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--neon-magenta)' }}>Tambah Target Baru</h2>
            <form onSubmit={handleAddGoal}>
              <div className="input-group">
                <label>Nama Target</label>
                <input
                  type="text"
                  className="input-field"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="Contoh: Beli Laptop"
                  required
                />
              </div>
              <div className="input-group" style={{ marginBottom: '2rem' }}>
                <label>Target Nominal (Rp)</label>
                <input
                  type="number"
                  className="input-field"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn" onClick={() => setShowGoalModal(false)} style={{ flex: 1, border: '1px solid var(--border-subtle)', background: 'transparent', color: 'var(--text-primary)' }}>BATAL</button>
                <button type="submit" className="btn btn-secondary" style={{ flex: 1 }}>BUAT TARGET</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component for Transaction Row to avoid repetition
function ActivityRow({ tx, formatMoney, formatDate, onDelete }) {
  const isIncome = tx.type === 'income';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className={`circle-icon ${isIncome ? 'bg-yellow' : 'bg-pink'}`}>
          {isIncome ? <ArrowUpCircle size={20} color="#000" /> : <ArrowDownCircle size={20} color="#000" />}
        </div>
        <div>
          <div style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{tx.title}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{formatDate(tx.date)}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div className={`badge-pill ${isIncome ? 'bg-green' : 'bg-pink'}`} style={{ fontSize: '1.1rem' }}>
          {isIncome ? '+' : '-'} {formatMoney(tx.amount)}
        </div>
        <button
          onClick={() => onDelete(tx.tx_id)}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            opacity: 0.5,
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--neon-magenta)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '280px',
    borderRight: '1px solid var(--border-subtle)',
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem 1.5rem',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid var(--border-subtle)',
    marginBottom: '2rem',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    border: '2px solid #000',
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  navItem: {
    padding: '0.75rem 1.5rem',
    borderRadius: '40px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    color: 'var(--text-primary)',
    fontWeight: '700',
    border: '4px solid #000000',
    transition: 'all 0.15s ease-out',
    boxShadow: '4px 4px 0px #000000',
  },
  navItemActive: {
    backgroundColor: 'var(--bg-green)',
    transform: 'translate(-2px, -2px)',
    boxShadow: '6px 6px 0px #000000',
  },
  navItemInactive: {
    backgroundColor: '#FFFFFF',
  },
  sidebarFooter: {
    marginTop: 'auto',
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center the title since search is gone
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '1.5rem',
  },
  balanceCard: {
    borderColor: 'var(--neon-green)',
    boxShadow: 'inset 0 0 20px rgba(178, 255, 0, 0.05)',
  },
  badge: {
    fontSize: '0.7rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '4px',
    letterSpacing: '1px',
  },
  balanceAmount: {
    fontSize: '4rem',
    fontWeight: '800',
    color: 'var(--neon-green)',
    letterSpacing: '-2px',
    margin: '1rem 0',
  },
  goalCard: {
    gridColumn: '1 / 2',
  },
  progressBarBg: {
    width: '100%',
    height: '24px',
    backgroundColor: '#FFFFFF',
    border: 'var(--border-thick)',
    borderRadius: '40px',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-hard-sm)'
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'var(--bg-yellow)',
    borderRight: 'var(--border-thick)',
  },
  activityCard: {
    gridColumn: '2 / 3',
    gridRow: '1 / 3',
    display: 'flex',
    flexDirection: 'column',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginTop: '1rem',
  },
  activityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 0',
    borderBottom: '1px solid var(--border-subtle)',
  },
  activityIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-subtle)',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(5px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    width: '100%',
    maxWidth: '400px',
  }
};

export default Dashboard;
