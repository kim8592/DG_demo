// ============================================
// CONSTANTS & CONFIG
// ============================================
const AUTHOR_NAME = "Trần Trọng Kim";
const AUTHOR_PHONE = "0964567806";

const STUDENT_STATUS = {
  ACTIVE: { id: 'active', label: 'Đang học', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  DROPPED: { id: 'dropped', label: 'Bỏ học', color: 'text-red-600', bg: 'bg-red-50' },
  TRANSFERRED: { id: 'transferred', label: 'Chuyển trường', color: 'text-amber-600', bg: 'bg-amber-50' },
  MOVED_CLASS: { id: 'moved_class', label: 'Chuyển lớp', color: 'text-blue-600', bg: 'bg-blue-50' }
};

const QUALITY_CRITERIA = [
  { id: 'patriotism', name: 'Yêu nước' },
  { id: 'humanity', name: 'Nhân ái' },
  { id: 'diligence', name: 'Chăm chỉ' },
  { id: 'honesty', name: 'Trung thực' },
  { id: 'responsibility', name: 'Trách nhiệm' }
];

const GENERAL_COMPETENCIES = [
  { id: 'self_control', name: 'Tự chủ & Tự học' },
  { id: 'communication', name: 'Giao tiếp & Hợp tác' },
  { id: 'problem_solving', name: 'Giải quyết vấn đề & Sáng tạo' }
];

const SPECIFIC_COMPETENCIES = [
  { id: 'lang', name: 'Ngôn ngữ' },
  { id: 'math', name: 'Tính toán' },
  { id: 'sci', name: 'Khoa học' },
  { id: 'tech', name: 'Công nghệ' },
  { id: 'it', name: 'Tin học' },
  { id: 'art', name: 'Thẩm mĩ' },
  { id: 'phys', name: 'Thể chất' }
];

const SUBJECT_TO_COMPETENCY_MAP = {
  'Tiếng Việt': 'lang',
  'Toán': 'math',
  'Khoa học': 'sci',
  'Tự nhiên và Xã hội': 'sci',
  'Công nghệ': 'tech',
  'Tin học': 'it',
  'Mĩ thuật': 'art',
  'Âm nhạc': 'art',
  'Giáo dục Thể chất': 'phys'
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const normalizeYearNameToPair = (name) => {
  const nums = String(name || '').match(/\d{4}/g);
  return nums && nums.length >= 2 ? [parseInt(nums[0], 10), parseInt(nums[1], 10)] : null;
};

const normalizeMonthNameToNumber = (name) => {
  const s = String(name || '').toLowerCase().trim();
  const digitMatch = s.match(/(\d{1,2})/);
  if (digitMatch) {
    const num = parseInt(digitMatch[1], 10);
    if (num >= 1 && num <= 12) return num;
  }

  const vn = {
    'tháng một':1, 'tháng hai':2, 'tháng ba':3, 'tháng tư':4, 'tháng năm':5, 'tháng sáu':6,
    'tháng bảy':7, 'tháng tám':8, 'tháng chín':9, 'tháng mười':10, 'tháng mười một':11, 'tháng mười hai':12,
    'tháng 1':1, 'tháng 2':2, 'tháng 3':3, 'tháng 4':4, 'tháng 5':5, 'tháng 6':6, 'tháng 7':7, 'tháng 8':8, 'tháng 9':9, 'tháng 10':10, 'tháng 11':11, 'tháng 12':12
  };
  for (const k in vn) if (s.includes(k)) return vn[k];

  const en = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  for (let i = 0; i < en.length; i++) if (s.includes(en[i])) return i + 1;
  return null;
};

const filterComments = (text) => {
  if (!text) return text;
  const replacements = [
    [/(?:cô|thầy|giáo\s+viên)\s+(?:muốn|yêu cầu|mong|hy vọng)\s+em/gi, 'Em hãy'],
    [/(?:cô|thầy|giáo\s+viên)\s+khuyến khích\s+em/gi, 'Em hãy'],
    [/(?:cô|thầy|giáo\s+viên)\s+tin\s+(?:rằng\s+)?em/gi, 'Em có khả năng'],
    [/(?:cô|thầy|giáo\s+viên)\s+(?:nói|bảo)\s+em/gi, 'Em'],
    [/(?:cô|thầy|giáo\s+viên)\s+hy vọng\s+em/gi, 'Em hãy'],
    [/(?:cô|thầy|giáo\s+viên)\s+nhận\s+xét/gi, ''],
    [/(?:cô|thầy|giáo\s+viên)\s+khen/gi, ''],
    [/,\s*(?:cô|thầy|giáo\s+viên)(?:\s+[^!.?]*)?(?=[!.?])/gi, ''],
  ];

  let filtered = text;
  replacements.forEach(([pattern, replacement]) => {
    filtered = filtered.replace(pattern, replacement);
  });

  return filtered.replace(/\bcô\b/g, '').replace(/\bthầy\b/g, '').replace(/\bgiáo\s+viên\b/gi, '')
    .replace(/\bcô\s+giáo\b/gi, '').replace(/\bthầy\s+giáo\b/gi, '').replace(/\s+/g, ' ').trim()
    .replace(/^[,\s]+/, '');
};

const copyToClipboard = (text) => {
  const tempInput = document.createElement("textarea");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
};

// ============================================
// REACT COMPONENTS
// ============================================
const { useState, useEffect, useRef } = React;

const ZaloIcon = ({ size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M22.507 11.23c-.156-.464-.34-.916-.548-1.353-.207-.436-.45-.858-.72-1.26a10.023 10.023 0 0 0-1.077-1.378 10.662 10.662 0 0 0-1.428-1.265 11.996 11.996 0 0 0-1.742-1.082A13.437 13.437 0 0 0 14.885 4.1a14.897 14.897 0 0 0-2.264-.474c-.38-.046-.763-.075-1.147-.087-.384-.012-.767-.008-1.15.012-.383.02-.764.055-1.145.105-.38.05-.758.115-1.134.195a14.864 14.864 0 0 0-2.22.65c-.358.13-.71.277-1.054.44a11.905 11.905 0 0 0-1.928 1.157 10.323 10.323 0 0 0-1.547 1.455c-.23.272-.44.558-.626.858a9.146 9.146 0 0 0-.825 2.022 9.146 9.146 0 0 0-.256 2.115c.01.353.04.706.087 1.055.048.35.114.697.198 1.04.084.343.187.68.307 1.01.12.33.256.654.407.97.15.316.315.626.494.927.18.3.37.593.578.877.207.284.426.56.654.825l-.578 2.316c-.052.207-.063.424-.032.636.03.21.096.413.195.6a1.442 1.442 0 0 0 .61.624c.24.13.51.196.78.196a1.517 1.517 0 0 0 .584-.117l3.522-1.507c.394.135.795.247 1.202.333.407.086.82.147 1.236.183.416.036.834.048 1.253.036.418-.012.836-.048 1.25-.108a14.892 14.892 0 0 0 2.417-.63 12.01 12.01 0 0 0 2.15-1.045 10.323 10.323 0 0 0 1.763-1.42 9.074 9.074 0 0 0 1.233-1.69 8.72 8.72 0 0 0 .864-2.128 9.052 9.052 0 0 0 .04-2.227z" />
  </svg>
);

const Toast = ({ message, type, icon }) => (
  <div className={`fixed top-6 right-6 z-[200] toast ${type === 'success' ? 'bg-emerald-50 border-emerald-300' : type === 'error' ? 'bg-red-50 border-red-300' : 'bg-blue-50 border-blue-300'} border-2 rounded-xl p-4 shadow-2xl max-w-sm`}>
    <div className="flex items-start gap-4">
      <span className="text-2xl mt-1">{icon}</span>
      <div className="flex-1">
        <p className={`font-black text-sm ${type === 'success' ? 'text-emerald-900' : type === 'error' ? 'text-red-900' : 'text-blue-900'} uppercase tracking-wide`}>
          {type === 'success' ? 'Thành công' : type === 'error' ? 'Lỗi' : 'Thông báo'}
        </p>
        <p className={`text-sm mt-1 ${type === 'success' ? 'text-emerald-700' : type === 'error' ? 'text-red-700' : 'text-blue-700'}`}>
          {message}
        </p>
      </div>
    </div>
  </div>
);

const EditableCell = ({ value, onSave, className, isDraft, disabled }) => {
  const [localValue, setLocalValue] = useState(value || '');
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = (textarea.scrollHeight + 2) + 'px';
    }
  };

  useEffect(() => {
    setLocalValue(value || '');
    const timer = setTimeout(adjustHeight, 0);
    return () => clearTimeout(timer);
  }, [value]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    setLocalValue(newVal);
    adjustHeight();
    onSave(newVal);
  };

  return (
    <textarea
      ref={textareaRef}
      disabled={disabled}
      className={`${className} ${isDraft ? 'bg-yellow-50 shadow-inner' : ''} ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-50 focus:bg-white'} overflow-hidden whitespace-pre-wrap break-words min-h-[40px] p-2 rounded transition-colors w-full resize-none`}
      rows={1}
      value={localValue}
      onChange={handleChange}
    />
  );
};

const SectionBox = ({ label, items, selectedId, onSelect, onEdit, onDelete, onAdd, type }) => (
  <div className="bg-white p-4 rounded-xl border-2 border-slate-300 shadow-sm flex flex-col gap-2 flex-1 min-w-[200px]">
    <div className="flex items-center justify-between mb-1">
      <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
      <div className="flex gap-1">
        {selectedId && !['system_comp'].includes(type) && (
          <>
            <button onClick={() => onEdit(items.find(i => i.id === selectedId))} className="p-1 text-blue-500 hover:bg-blue-50 rounded text-xs">✏️</button>
            <button onClick={() => onDelete(selectedId)} className="p-1 hover:text-red-600 text-xs">🗑️</button>
          </>
        )}
        {!['system_comp'].includes(type) && <button onClick={onAdd} className="p-1 text-indigo-500 text-xs">➕</button>}
      </div>
    </div>
    <select value={selectedId || ''} onChange={(e) => onSelect(e.target.value)} className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold outline-none cursor-pointer hover:bg-white transition-all">
      <option value="">-- {label} --</option>
      {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
    </select>
  </div>
);

const LoginForm = ({ email, setEmail, password, setPassword, onLogin, toast }) => (
  <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:"100vh" }}>
    <div style={{ background:"#ffffff", padding:"35px", borderRadius:"12px", width:"320px", boxShadow:"0 10px 25px rgba(0,0,0,0.15)", border:"1px solid #eee" }}>
      <h3 style={{ textAlign:"center", fontSize:"20px", fontWeight:"bold", marginBottom:"20px", color:"#4f46e5" }}>Đăng nhập giáo viên</h3>
      <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} style={{ width:"100%", padding:"10px", marginBottom:"12px", borderRadius:"6px", border:"1px solid #ccc", fontSize:"14px", boxSizing:"border-box" }} />
      <input type="password" placeholder="Mật khẩu" value={password} onChange={(e)=>setPassword(e.target.value)} style={{ width:"100%", padding:"10px", marginBottom:"12px", borderRadius:"6px", border:"1px solid #ccc", fontSize:"14px", boxSizing:"border-box" }} />
      <button onClick={onLogin} style={{ width:"100%", padding:"10px", background:"#4f46e5", color:"white", border:"none", borderRadius:"6px", fontWeight:"bold", cursor:"pointer" }}>Đăng nhập</button>
      {toast && <Toast {...toast} />}
    </div>
  </div>
);

// ============================================
// MAIN APP COMPONENT
// ============================================
const App = () => {
  // Auth & UI
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isAuthValid, setIsAuthValid] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [toast, setToast] = useState(null);

  // Data
  const [years, setYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [months, setMonths] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentData, setStudentData] = useState({});
  const [draftData, setDraftData] = useState({});

  // Selection
  const [selectedYearId, setSelectedYearId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedMonthId, setSelectedMonthId] = useState('');
  const [selectedSubId, setSelectedSubId] = useState('');
  const [selectedCriteriaId, setSelectedCriteriaId] = useState('');

  // View
  const [viewMode, setViewMode] = useState('subject');
  const [systemMode, setSystemMode] = useState('smas');
  const [showLevel, setShowLevel] = useState(true);
  const [showNote, setShowNote] = useState(true);

  // Modal
  const [modalType, setModalType] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [bulkInput, setBulkInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copySuccess, setCopySuccess] = useState(null);
  const [statusModalStudent, setStatusModalStudent] = useState(null);
  const [showMoveTargetSelect, setShowMoveTargetSelect] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');

  // Drag
  const [draggedStudentId, setDraggedStudentId] = useState(null);
  const [dragOverStudentId, setDragOverStudentId] = useState(null);

  const showToast = (message, type = 'info', icon = 'ℹ️', duration = 4000) => {
    setToast({ message, type, icon });
    setTimeout(() => setToast(null), duration);
  };

  // ===== AUTH =====
  const handleLogin = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      showToast("Sai email hoặc mật khẩu", "error", "❌");
    }
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      showToast("Đã đăng xuất", "success", "✅");
    } catch (e) {
      showToast("Lỗi đăng xuất", "error", "❌");
    }
  };

  const handleChangeName = async () => {
    const newName = prompt("Nhập tên mới");
    if(!newName) return;
    try {
      await user.updateProfile({displayName: newName});
      showToast("Đổi tên thành công", "success", "✅");
    } catch (e) {
      showToast("Lỗi đổi tên", "error", "❌");
    }
  };

  const handleChangePassword = async () => {
    const newPass = prompt("Nhập mật khẩu mới");
    if(!newPass) return;
    try {
      await user.updatePassword(newPass);
      showToast("Đổi mật khẩu thành công", "success", "✅");
    } catch (e) {
      showToast("Lỗi đổi mật khẩu", "error", "❌");
    }
  };

  // ===== EFFECTS =====
  useEffect(() => {
    const _v = (s) => btoa(unescape(encodeURIComponent(s)));
    if (_v(AUTHOR_NAME) !== "VHLhuqduIFRy4buNbmcgS2lt" || _v(AUTHOR_PHONE) !== "MDk2NDU2NzgwNg==") {
      setIsAuthValid(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !isAuthValid) return;
    try {
      const unsubYears = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years')
        .onSnapshot(s => setYears(s.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))));
      const unsubCla = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('classes')
        .onSnapshot(s => setClasses(s.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => a.name.localeCompare(b.name, 'vi', { numeric: true }))));
      const unsubMon = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('months')
        .onSnapshot(s => setMonths(s.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))));
      const unsubSub = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('subjects')
        .onSnapshot(s => setSubjects(s.docs.map(d => ({id: d.id, ...d.data()})).sort((a, b) => a.name.localeCompare(b.name, 'vi'))));
      return () => { unsubYears(); unsubCla(); unsubMon(); unsubSub(); };
    } catch (e) {
      console.error('Data load error:', e);
    }
  }, [user, isAuthValid]);

  useEffect(() => {
    if (!years.length || selectedYearId || !isAuthValid) return;
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const start = month >= 8 ? year : year - 1;
    const end = month >= 8 ? year + 1 : year;
    const found = years.find(y => {
      const pair = normalizeYearNameToPair(y.name);
      return pair && pair[0] === start && pair[1] === end;
    });
    if (found) setSelectedYearId(found.id);
  }, [years, isAuthValid]);

  useEffect(() => {
    if (!months.length || selectedMonthId || !isAuthValid) return;
    const currentMonth = new Date().getMonth() + 1;
    const found = months.find(m => normalizeMonthNameToNumber(m.name) === currentMonth);
    if (found) setSelectedMonthId(found.id);
  }, [months, isAuthValid]);

  useEffect(() => {
    if (!user || !classes.length || !subjects.length || sessionReady) return;
    const key = `teacher_${user.uid}_session`;
    const saved = localStorage.getItem(key);
    if (!saved) {
      setSessionReady(true);
      return;
    }
    try {
      const data = JSON.parse(saved);
      if (data.selectedClassId && classes.find(x => x.id === data.selectedClassId)) setSelectedClassId(data.selectedClassId);
      if (data.selectedSubId && subjects.find(x => x.id === data.selectedSubId)) setSelectedSubId(data.selectedSubId);
      if (data.systemMode) setSystemMode(data.systemMode);
    } catch (e) {
      console.error("Session load error:", e);
    }
    setSessionReady(true);
  }, [user, classes, subjects]);

  useEffect(() => {
    if (!user || !sessionReady) return;
    const key = `teacher_${user.uid}_session`;
    localStorage.setItem(key, JSON.stringify({ selectedClassId, selectedSubId, systemMode }));
  }, [user, selectedClassId, selectedSubId, systemMode, sessionReady]);

  useEffect(() => {
    if (!user || !selectedClassId || !selectedYearId || !isAuthValid) { 
      setStudents([]); 
      return; 
    }
    try {
      return db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years').doc(selectedYearId)
        .collection('classes').doc(selectedClassId).collection('students')
        .onSnapshot((snap) => {
          const list = snap.docs.map(d => ({ id: d.id, status: 'active', ...d.data() }));
          list.sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
            return (a.createdAt || 0) - (b.createdAt || 0);
          });
          setStudents(list);
        });
    } catch (e) {
      console.error('Students load error:', e);
    }
  }, [user, selectedClassId, selectedYearId, isAuthValid]);

  useEffect(() => {
    if (!user || !selectedMonthId || !selectedClassId || !selectedYearId || !isAuthValid) { 
      setStudentData({}); 
      setDraftData({}); 
      return; 
    }
    const isSubject = viewMode === 'subject';
    const isVnEduSubMode = systemMode === 'vnedu' && viewMode !== 'subject';
    if (isSubject && !selectedSubId) { setStudentData({}); setDraftData({}); return; }
    if (isVnEduSubMode && !selectedCriteriaId) { setStudentData({}); setDraftData({}); return; }

    const systemSuffix = systemMode === 'vnedu' ? '_vnedu' : '';
    let key = "";
    if (isSubject) {
      key = `${selectedYearId}_${selectedSubId}_${selectedMonthId}_${selectedClassId}${systemSuffix}`;
    } else if (isVnEduSubMode) {
      key = `${selectedYearId}_${viewMode}_vnedu_${selectedCriteriaId}_${selectedMonthId}_${selectedClassId}`;
    } else {
      key = `${selectedYearId}_${viewMode}_${selectedMonthId}_${selectedClassId}`;
    }
    
    try {
      return db.collection('artifacts').doc(appId).collection('public').doc('data').collection('comments').doc(key)
        .collection('entries').onSnapshot((snap) => {
          const data = {};
          snap.forEach(doc => { data[doc.id] = doc.data(); });
          setStudentData(data);
          setDraftData({});
        });
    } catch (e) {
      console.error('Student data load error:', e);
    }
  }, [user, selectedSubId, selectedCriteriaId, selectedMonthId, selectedClassId, selectedYearId, viewMode, isAuthValid, systemMode]);

  // ===== FUNCTIONS =====
  const saveApiKey = (key) => {
    localStorage.setItem('gemini_api_key', key);
    setApiKey(key);
    setShowApiKeyModal(false);
    showToast('API Key đã lưu thành công', 'success', '🔑', 3000);
  };

  const updateDraft = (studentId, field, value) => {
    const stu = students.find(s => s.id === studentId);
    if (stu?.status !== 'active') return;

    setDraftData(prev => {
      const currentStudentDraft = prev[studentId] || {};
      const currentStoredData = studentData[studentId] || {};
      let finalValue = value;
      if (field.startsWith('level')) {
        const currentLevel = currentStudentDraft[field] !== undefined ? currentStudentDraft[field] : (currentStoredData[field] || "");
        if (currentLevel === value) finalValue = "";
      }
      return { ...prev, [studentId]: { ...currentStudentDraft, [field]: finalValue } };
    });
  };

  const handleUpdateStatus = async (studentId, status) => {
    if (status === 'moved_class') {
      setShowMoveTargetSelect(true);
      return;
    }
    try {
      await db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years').doc(selectedYearId)
        .collection('classes').doc(selectedClassId).collection('students').doc(studentId).update({ status });
      setStatusModalStudent(null);
      showToast('Cập nhật trạng thái thành công', 'success', '✅', 3000);
    } catch (e) { 
      console.error(e); 
      showToast('Lỗi cập nhật trạng thái: ' + e.message, 'error', '❌', 4000);
    }
  };

  const handleMoveStudentToClass = async (targetClassId) => {
    if (!statusModalStudent || !targetClassId || isMoving) return;
    setIsMoving(true);
    try {
      const batch = db.batch();
      const newStudentRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years').doc(selectedYearId)
        .collection('classes').doc(targetClassId).collection('students').doc();
      batch.set(newStudentRef, {
        name: statusModalStudent.name,
        status: 'active',
        createdAt: statusModalStudent.createdAt || Date.now(),
        movedFrom: selectedClassId
      });
      const oldStudentRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years').doc(selectedYearId)
        .collection('classes').doc(selectedClassId).collection('students').doc(statusModalStudent.id);
      batch.delete(oldStudentRef);
      await batch.commit();
      setStatusModalStudent(null);
      setShowMoveTargetSelect(false);
      showToast('Di chuyển học sinh thành công', 'success', '✅', 3000);
    } catch (e) { 
      console.error("Lỗi di chuyển học sinh:", e); 
      showToast('Lỗi di chuyển: ' + e.message, 'error', '❌', 4000);
    } finally { setIsMoving(false); }
  };

    const handleDragStart = (e, studentId) => {
    setDraggedStudentId(studentId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, studentId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (draggedStudentId && draggedStudentId !== studentId) {
      setDragOverStudentId(studentId);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOverStudentId(null);
  };

  const handleDrop = async (e, targetStudentId) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedStudentId || draggedStudentId === targetStudentId) {
      setDraggedStudentId(null);
      setDragOverStudentId(null);
      return;
    }

    const draggedIndex = students.findIndex(s => s.id === draggedStudentId);
    const targetIndex = students.findIndex(s => s.id === targetStudentId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedStudentId(null);
      setDragOverStudentId(null);
      return;
    }

    const newList = [...students];
    const draggedStudent = newList[draggedIndex];
    
    newList.splice(draggedIndex, 1);
    newList.splice(targetIndex, 0, draggedStudent);

    try {
      const batch = db.batch();
      newList.forEach((stu, i) => {
        const ref = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years').doc(selectedYearId)
          .collection('classes').doc(selectedClassId).collection('students').doc(stu.id);
        batch.update(ref, { order: i });
      });
      await batch.commit();
      showToast('Sắp xếp học sinh thành công', 'success', '✅', 2000);
    } catch (e) { 
      console.error("Lỗi sắp xếp:", e); 
      showToast('Lỗi sắp xếp: ' + e.message, 'error', '❌', 4000);
    } finally {
      setDraggedStudentId(null);
      setDragOverStudentId(null);
    }
  };

  const handleSaveAllToFirebase = async () => {
    const studentIds = Object.keys(draftData);
    if (studentIds.length === 0) return;
    setIsSaving(true);
    try {
      const systemSuffix = systemMode === 'vnedu' ? '_vnedu' : '';
      const isVnEduSubMode = systemMode === 'vnedu' && viewMode !== 'subject';
      let key = "";
      if (viewMode === 'subject') key = `${selectedYearId}_${selectedSubId}_${selectedMonthId}_${selectedClassId}${systemSuffix}`;
      else if (isVnEduSubMode) key = `${selectedYearId}_${viewMode}_vnedu_${selectedCriteriaId}_${selectedMonthId}_${selectedClassId}`;
      else key = `${selectedYearId}_${viewMode}_${selectedMonthId}_${selectedClassId}`;

      const docRefCheck = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('comments').doc(key);
      const entriesSnap = await docRefCheck.collection('entries').limit(1).get();

      if (!entriesSnap.empty) {
        const first = entriesSnap.docs[0].data();
        if (first.owner && first.owner !== user.uid) {
          const ok = window.confirm(`⚠️ Môn này đang do "${first.ownerName || 'giáo viên khác'}" phụ trách.\n\nBạn có muốn nhận quyền để chỉnh sửa không?`);
          if (!ok) {
            setIsSaving(false);
            return;
          }
        }
      }

      const batch = db.batch();
      for (const sId of studentIds) {
        const docRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('comments').doc(key)
          .collection('entries').doc(sId);
        const updates = draftData[sId];
        batch.set(docRef, {
          ...updates,
          owner: user.uid,
          ownerName: user.displayName || user.email,
          lastModified: new Date().toISOString()
        }, { merge: true });

        if (viewMode === 'subject' && updates.level !== undefined) {
          const subjectName = subjects.find(s => s.id === selectedSubId)?.name;
          const targetCompId = SUBJECT_TO_COMPETENCY_MAP[subjectName];
          if (targetCompId) {
            let compKey = "";
            let compField = "level";
            let compLevelValue = updates.level === 'H' ? 'Đ' : updates.level;
            if (systemMode === 'smas') {
              compKey = `${selectedYearId}_specific_${selectedMonthId}_${selectedClassId}`;
              compField = `level_${targetCompId}`;
            } else {
              compKey = `${selectedYearId}_specific_vnedu_${targetCompId}_${selectedMonthId}_${selectedClassId}`;
              compField = "level";
            }
            const compDocRef = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('comments').doc(compKey)
              .collection('entries').doc(sId);
            batch.set(compDocRef, { 
              [compField]: compLevelValue,
              lastModified: new Date().toISOString()
            }, { merge: true });
          }
        }
      }
      await batch.commit();
      setDraftData({});
      showToast(`Đã lưu ${studentIds.length} học sinh thành công`, 'success', '✅', 3000);
    } catch (error) { 
      console.error(error); 
      showToast('Lỗi lưu dữ liệu: ' + error.message, 'error', '❌', 4000);
    } finally { setIsSaving(false); }
  };

  // ===== AI GENERATION (GỌI 1 LẦN, DÙNG TEXT FORMAT) =====
  // ===== AI GENERATION (GROQ WITH SMART QUEUE & RETRY) =====
  // ===== AI GENERATION (GROQ WITH SMART QUEUE & RETRY) =====
    // ===== AI GENERATION (GROQ WITH SMART RETRY & VALIDATION) =====
  const runAI = async () => {
  if (!isAuthValid) return;

  const allTargets = students.filter(s => {
    if (s.status !== 'active') return false;
    const d = studentData[s.id] || {};
    const draft = draftData[s.id] || {};
    const comment = draft.comment !== undefined ? draft.comment : (d.comment || "");
    if (comment) return false;
    if (viewMode === 'subject') {
      const level = draft.level !== undefined ? draft.level : (d.level || "");
      return !!level;
    } else if (systemMode === 'vnedu' && viewMode !== 'subject') {
      const level = draft.level !== undefined ? draft.level : (d.level || "");
      return !!level;
    } else if (systemMode === 'smas' && viewMode !== 'subject') {
      const list = viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES);
      return list.some(c => {
        const level = draft[`level_${c.id}`] !== undefined ? draft[`level_${c.id}`] : (d[`level_${c.id}`] || "");
        return !!level;
      });
    }
    return false;
  });

  if (!allTargets.length) { 
    showToast('Không có học sinh nào cần nhận xét', 'info', '⚠️', 4000);
    return; 
  }

  setIsGenerating(true);
  showToast(`Đang tạo nhận xét cho ${allTargets.length} học sinh...`, 'info', '⏳', 2000);

  try {
    const competencySkillMap = {
      'quality': {
        'Yêu nước': 'tôn trọng quốc kỳ, hiểu biết về đất nước',
        'Nhân ái': 'giúp đỡ bạn, chia sẻ, quan tâm mọi người',
        'Chăm chỉ': 'hoàn thành bài tập, tham gia tích cực, không lười biếng',
        'Trung thực': 'nói thật, không gian lận, thừa nhận lỗi',
        'Trách nhiệm': 'hoàn thành nhiệm vụ, chịu trách nhiệm hành động'
      },
      'competency': {
        'Tự chủ & Tự học': 'tự tổ chức học tập, không cần nhắc nhở, tự giải quyết khó khăn',
        'Giao tiếp & Hợp tác': 'làm việc nhóm tốt, lắng nghe bạn, chia sẻ ý kiến',
        'Giải quyết vấn đề & Sáng tạo': 'tìm giải pháp mới, suy nghĩ sáng tạo, giải quyết tình huống'
      },
      'specific': {
        'Ngôn ngữ': 'đọc hiểu, viết mạch lạc, nói rõ ràng, chính tả chính xác',
        'Tính toán': 'thực hiện phép tính, giải bài toán, hiểu các khái niệm toán học',
        'Khoa học': 'quan sát hiện tượng, thí nghiệm, giải thích tự nhiên',
        'Công nghệ': 'sử dụng công cụ, thực hành kỹ thuật, tạo ra sản phẩm',
        'Tin học': 'sử dụng máy tính, gõ phím, tìm kiếm thông tin',
        'Thẩm mĩ': 'vẽ, tô màu, sáng tạo mĩ thuật, cảm nhận vẻ đẹp',
        'Thể chất': 'chạy, nhảy, thể dục, phối hợp vận động, sức khỏe'
      }
    };

    const parsePromptKeywords = (prompt) => {
      if (!prompt || prompt.trim() === '') return [];
      const keywords = prompt.split(/[|,]/).map(k => k.trim()).filter(k => k);
      return keywords;
    };

    const keywords = parsePromptKeywords(aiPrompt);

    if (keywords.length === 0) {
      showToast('⚠️ Vui lòng nhập từ khóa phù hợp với môn học/năng lực/phẩm chất (VD: công|nhân|giải toán)', 'warning', '⚠️', 9000);
      setIsGenerating(false);
      return;
    }

    const commentTemplates = {
      'T': [
        'Em luôn thành thạo {keyword}, thể hiện sự tập trung và hiểu biết sâu sắc.',
        'Em nắm vững {keyword}, hoàn thành xuất sắc tất cả bài tập.',
        'Em thực hiện {keyword} một cách chính xác và hiệu quả.',
        'Em thể hiện kỹ năng {keyword} ở mức độ xuất sắc.',
        'Em có khả năng {keyword} vượt trội, rất đáng khen ngợi.',
        'Em thành thạo trong {keyword}, đạt kết quả rất tốt.',
        'Em biểu hiện tài năng trong {keyword}, luôn hoàn thành tốt.',
        'Em làm chủ {keyword}, tỏ ra rất giỏi giang.',
        'Em phát huy tốt {keyword}, có kết quả vô cùng ấn tượng.',
        'Em thực hiện {keyword} với độ chính xác cao, rất xứng đáy được biểu dương.',
        'Em tiếp cận {keyword} một cách sáng tạo và linh hoạt.',
        'Em nỗ lực với {keyword} và đã đạt được thành tựu đáng kể.',
        'Em có thế mạnh rõ rệt ở {keyword}.',
        'Em thể hiện khả năng vượt trội với {keyword}.',
        'Em hoàn toàn làm chủ {keyword}, tỏ ra rất xuất sắc.'
      ],
      'H': [
        'Em hoàn thành tốt {keyword}, nắm vững kiến thức cơ bản. Hãy tiếp tục rèn luyện để nâng cao hơn.',
        'Em thực hiện được {keyword}, nhưng cần luyện tập thêm để thành thạo hơn.',
        'Em có những tiến bộ tích cực với {keyword}. Hãy tiếp tục phát huy và cải thiện.',
        'Em nắm được kiến thức {keyword}, nhưng cần tập luyện để kỹ năng được hoàn thiện.',
        'Em cố gắng với {keyword}, kết quả tạm ổn. Hãy chăm chỉ luyện tập thêm.',
        'Em thực hiện {keyword} được. Em chú ý tăng cường luyện tập thêm sẽ tốt hơn.',
        'Em đạt được {keyword} ở mức tốt. Hãy tiếp tục nỗ lực để nâng cao.',
        'Em tiếp thu {keyword} khá tốt, cần ôn tập thêm để vững chắc hơn.',
        'Em biểu hiện năng lực tốt với {keyword}, nhưng vẫn có chỗ cần cải thiện.',
        'Em thể hiện được khả năng {keyword} ở mức khá. Hãy luyện tập để xuất sắc hơn.',
        'Em làm tốt {keyword} nhưng cần có sự kiên trì để phát triển hơn.',
        'Em biểu hiện năng lực khá với {keyword}. Hãy tiếp tục rèn luyện.',
        'Em hoàn thành {keyword} một cách tương đối tốt. Cố gắng thêm sẽ đạt kết quả cao hơn.',
        'Em thực hiện {keyword} ở mức chấp nhận được, cần rèn luyện thêm.',
        'Em có sự cố gắng với {keyword}. Tiếp tục nỗ lực để phát triển toàn diện.'
      ],
      'Đ': [
        'Em hoàn thành tốt {keyword}, nắm vững kiến thức cơ bản. Hãy tiếp tục rèn luyện để nâng cao hơn.',
        'Em thực hiện được {keyword}, hãy cố gắng luyện tập thêm để thành thạo hơn.',
        'Em có những tiến bộ tích cực với {keyword}. Hãy tiếp tục phát huy và cải thiện.',
        'Em nắm được kiến thức {keyword}, nhưng cần tập luyện để kỹ năng được hoàn thiện.',
        'Em hoàn thành với {keyword}, kết quả tạm ổn. Hãy chăm chỉ luyện tập thêm.',
        'Em thực hiện {keyword} được. Em hãy chú ý luyện thêm sẽ tốt hơn.',
        'Em đạt được {keyword} ở mức cơ bản. Hãy tiếp tục nỗ lực để nâng cao.',
        'Em tiếp thu {keyword} được, nhưng cần ôn tập thêm để vững vàng hơn.',
        'Em hoàn thành được {keyword} ở mức chấp nhận. Hãy cố gắng để tiến bộ hơn.',
        'Em thực hiện {keyword} khá tốt. Tiếp tục luyện tập để nâng cao trình độ.',
        'Em biểu hiện năng lực với {keyword} ở mức cơ bản, cần rèn luyện thêm.',
        'Em đạt được {keyword}, nhưng còn có những điểm cần cải thiện.',
        'Em làm được {keyword} nhưng chưa thực sự thành thạo. Luyện thêm sẽ tốt hơn.',
        'Em thể hiện được khả năng {keyword} ở mức khiêm tốn. Hãy tiếp tục nỗ lực.',
        'Em hoàn thành được yêu cầu {keyword}. Hãy rèn luyện thêm để phát triển.'
      ],
      'C': [
        'Em có cố gắng trong {keyword}. Em cần luyện tập thêm để thực hiện tốt hơn.',
        'Em đã bước đầu làm quen với {keyword}. Cần tiếp tục rèn luyện để tiến bộ rõ hơn.',
        'Em có tinh thần học tập trong {keyword}. Nên dành thời gian ôn luyện thêm để cải thiện.',
        'Em đã có sự cố gắng với {keyword}. Cần chú ý luyện tập thường xuyên để nắm vững hơn.',
        'Em có tham gia học tập {keyword}. Hãy tiếp tục rèn luyện để đạt kết quả tốt hơn.',
        'Em bước đầu thực hiện được {keyword}. Cần ôn tập lại để nâng cao kỹ năng.',
        'Em có ý thức học {keyword}. Nên luyện tập thêm để tự tin hơn khi làm bài.',
        'Em có cố gắng trong giờ học {keyword}. Cần chú ý rèn luyện thêm để tiến bộ hơn.',
        'Em đã tham gia học tập {keyword}. Hãy dành thêm thời gian luyện tập để cải thiện.',
        'Em có sự nỗ lực với {keyword}. Cần tiếp tục ôn luyện để đạt kết quả tốt hơn.',
        'Em đã cố gắng thực hiện {keyword}. Nên rèn luyện thêm để hoàn thiện hơn.',
        'Em có tinh thần học {keyword}. Cần chú ý luyện tập thêm để đạt yêu cầu tốt hơn.',
        'Em đã có sự cố gắng trong {keyword}. Hãy mạnh dạn hỏi thêm và luyện tập nhiều hơn.',
        'Em bước đầu hiểu {keyword}. Cần kiên trì luyện tập để tiến bộ rõ hơn.',
        'Em có tham gia học {keyword}. Nên tìm cách luyện tập thêm để nâng cao kết quả.'
      ]
    };

    const usedComments = {};
    
    const generateUniqueComment = (level, keyword) => {
      if (!usedComments[level]) {
        usedComments[level] = [];
      }

      const templates = commentTemplates[level] || commentTemplates['C'];
      const availableTemplates = templates.filter(t => !usedComments[level].includes(t));
      
      if (availableTemplates.length === 0) {
        usedComments[level] = [];
        return templates[Math.floor(Math.random() * templates.length)].replace('{keyword}', keyword);
      }
      
      const selectedTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
      usedComments[level].push(selectedTemplate);
      
      return selectedTemplate.replace('{keyword}', keyword);
    };

    const getStudentInfo = (stu) => {
      const d = studentData[stu.id] || {};
      const draft = draftData[stu.id] || {};
      const note = draft.note !== undefined ? draft.note : (d.note || "");
      
      if (viewMode === 'subject') {
        const level = draft.level !== undefined ? draft.level : (d.level || "");
        return { type: 'subject', level, data: null, note };
      } 
      else if (systemMode === 'vnedu' && viewMode !== 'subject') {
        const level = draft.level !== undefined ? draft.level : (d.level || "");
        return { type: 'vnedu_single', level, data: null, note };
      } 
      else if (systemMode === 'smas' && viewMode !== 'subject') {
        const list = viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES);
        const skillMap = competencySkillMap[viewMode] || {};
        
        const items = [];
        list.forEach(c => {
          const lv = draft[`level_${c.id}`] !== undefined ? draft[`level_${c.id}`] : (d[`level_${c.id}`] || "");
          if (lv) {
            const skill = skillMap[c.name] || c.name;
            items.push({ skill, level: lv });
          }
        });

        let mainLevel = 'C';
        if (items.some(i => i.level === 'T')) mainLevel = 'T';
        else if (items.some(i => i.level === 'H' || i.level === 'Đ')) mainLevel = 'H';

        return { 
          type: viewMode,
          level: mainLevel,
          data: items,
          note
        };
      }

      return { type: 'unknown', level: 'C', data: null, note };
    };

    const basicComments = {};
    allTargets.forEach(stu => {
      const info = getStudentInfo(stu);

      if (info.level) {
        if (info.type === 'subject' || info.type === 'vnedu_single') {
          const selectedKeyword = keywords[Math.floor(Math.random() * keywords.length)];
          const comment = generateUniqueComment(info.level, selectedKeyword);
          basicComments[stu.id] = { 
            comment, 
            level: info.level, 
            type: info.type,
            note: info.note
          };
        } else {
          const selectedKeyword = keywords[Math.floor(Math.random() * keywords.length)];
          basicComments[stu.id] = { 
            comment: null,
            level: info.level,
            type: info.type,
            data: info.data,
            keyword: selectedKeyword,
            note: info.note
          };
        }
      }
    });

    if (Object.keys(basicComments).length === 0) {
      showToast('❌ Không có học sinh nào để tạo nhận xét', 'error', '❌', 4000);
      setIsGenerating(false);
      return;
    }

    if (!apiKey) {
      const updates = {};
      for (const [sId, data] of Object.entries(basicComments)) {
        if (data.comment) {
          updates[sId] = data.comment;
        }
      }
      
      if (Object.keys(updates).length > 0) {
        setDraftData(prev => {
          const updated = { ...prev };
          for (const sId of Object.keys(updates)) {
            updated[sId] = {
              ...(prev[sId] || {}),
              comment: updates[sId]
            };
          }
          return updated;
        });
        setIsGenerating(false);
        showToast(`✅ Tạo nhận xét cơ bản: ${Object.keys(updates).length}/${allTargets.length}`, 'success', '✅', 3000);
      } else {
        setIsGenerating(false);
      }
      return;
    }

    // ===== HELPER: VALIDATE RESPONSE =====
    const isValidComment = (comment) => {
      if (!comment || typeof comment !== 'string') return false;
      const cleaned = comment.replace(/\[.*?\]/g, '').trim();
      const wordCount = cleaned.split(/\s+/).length;
      // Validate: 30-200 từ, bắt đầu "Em", không chỉ là ID
      return cleaned.length > 30 && 
             wordCount >= 8 && 
             wordCount <= 200 && 
             cleaned.toLowerCase().startsWith('em') &&
             !/^\d+$/.test(cleaned.substring(0, 10));
    };

    // ===== HELPER: VALIDATE BATCH RESPONSE =====
    const isValidBatchResponse = (responseText) => {
      const lines = responseText.split('\n').filter(line => line.trim() && line.includes('|||'));
      return lines.length > 0 && lines.some(line => {
        const parts = line.split('|||');
        return parts.length >= 2 && isValidComment(parts[1]);
      });
    };

    // ===== GROQ API BATCH PROCESSING =====
    const delayFn = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    const BATCH_SIZE = 15;  // Giảm từ 30 xuống 25 để tăng chất lượng
    const commentIds = Object.keys(basicComments);
    const batchCount = Math.ceil(commentIds.length / BATCH_SIZE);
    const allUpdates = {};
    let totalSuccessCount = 0;

    for (let batchIdx = 0; batchIdx < batchCount; batchIdx++) {
      const start = batchIdx * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, commentIds.length);
      const batchIds = commentIds.slice(start, end);
      
      const batchData = {};
      batchIds.forEach(id => {
        batchData[id] = basicComments[id];
      });

      // ===== GỘP DỮ LIỆU VÀ MERGE GHI CHÚ =====
      let commentsList = "";
      let isSmAsMode = false;
      let levelCounts = { T: 0, 'H/Đ': 0, C: 0 };

      Object.entries(batchData).forEach(([sId, data]) => {
        if (data.comment) {
          const noteStr = data.note ? ` (Ghi chú: ${data.note})` : '';
          commentsList += `${sId}|${data.comment}${noteStr}\n`;
        } else if (data.data) {
          const skillsStr = data.data.map(i => `${i.skill}:${i.level}`).join(', ');
          const noteStr = data.note ? ` (Ghi chú: ${data.note})` : '';
          commentsList += `${sId}|Mức ${data.level}|${skillsStr}${noteStr}\n`;
          isSmAsMode = true;
          // Đếm mức để tối ưu prompt
          if (data.level === 'T') levelCounts.T++;
          else if (data.level === 'H') levelCounts['H/Đ']++;
          else levelCounts.C++;
        }
      });

     const systemPrompt = isSmAsMode
      ? `Bạn là giáo viên tiểu học Việt Nam. SỬA LẠI nhận xét từ công việc/kỹ năng.
HƯỚNG DẪN THEO MỨC:
  MỨC T: Khen điểm nổi bậc.
  MỨC H/Đ: Khen điểm nổi bật và nêu hướng phát huy.
  MỨC C: Khen cố gắng, nêu hạn chế, nêu hướng khắc phục.
RULE QUAN TRỌNG: 
- MỖI nhận xét PHẢI khác nhau hoàn toàn, không lặp
- Nếu câu gốc sai chính tả, thiếu chữ, hoặc chưa rõ nghĩa → PHẢI tự hiểu và viết lại thành câu hoàn chỉnh, rõ nghĩa.
- KHÔNG giữ nguyên câu sai.
- PHẢI có 15-17 từ
- Bắt đầu "Em"
- Nếu có "(Ghi chú: ...)" thì TÍCH HỢP tự nhiên vào nhận xét, VÍ DỤ thay vì nói "nhẩm nhanh" ở cuối, hãy viết "với khả năng nhẩm nhanh rất tốt"
- XÓA tất cả dấu ngoặc []
- KHÔNG để "(Ghi chú: ...)" trong kết quả final
- Không để response rỗng
- OUTPUT MỖI EM 1 DÒNG: [ID]|||[Nhận xét 15-17 từ]`
      : `Sửa lại các nhận xét tiểu học cho hay hơn, tự nhiên hơn.
RULE QUAN TRỌNG:
- MỖI nhận xét PHẢI khác nhau hoàn toàn, không lặp
- Nếu câu gốc sai chính tả, thiếu chữ, hoặc chưa rõ nghĩa → PHẢI tự hiểu và viết lại thành câu hoàn chỉnh, rõ nghĩa.
- KHÔNG giữ nguyên câu sai.
- Giữ nguyên ý chính, mức đánh giá
- PHẢI có 15-17 từ
- Nếu có "(Ghi chú: ...)" thì TÍCH HỢP tự nhiên vào câu, VÍ DỤ thay vì nói "nhẩm nhanh" ở cuối, hãy viết "với khả năng nhẩm nhanh rất tốt"
- XÓA tất cả dấu ngoặc [] và "(Ghi chú: ...)"
- Không để response rỗng
- OUTPUT MỖI EM 1 DÒNG: [ID]|||[Nhận xét 20-25 từ]`;

      const userInstruction = `Dữ liệu nhận xét (ID|thông tin):
${commentsList}

${isSmAsMode ? 'Nâng cấp nhận xét, mỗi em PHẢI khác nhau, 60-70 từ' : 'Sửa lại để hay hơn, mỗi em PHẢI khác nhau, 60-70 từ'}.
Tích hợp ghi chú nếu có, xóa dấu ngoặc.
KHÔNG để rỗng!`;

      let retryCount = 0;
      const maxRetries = 3;
      let responseText = null;

      while (retryCount < maxRetries && !responseText) {
        try {
          console.log(`📢 Groq Batch ${batchIdx + 1}/${batchCount} (lần ${retryCount + 1})...`);
          showToast(`⏳ Batch ${batchIdx + 1}/${batchCount} (lần ${retryCount + 1})`, 'info', '📊', 1000);

          const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ 
              model: 'llama-3.3-70b-versatile',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userInstruction }
              ],
              temperature: 0.7,
              max_tokens: 4000,
              top_p: 0.9,
              frequency_penalty: 0.5  // ⭐ Giảm lặp lại
            })
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }

          const result = await response.json();
          const text = result.choices?.[0]?.message?.content || "";
          
          // ✅ VALIDATE response
          if (isValidBatchResponse(text)) {
            responseText = text;
            console.log(`✅ Response hợp lệ`);
          } else {
            console.warn(`⚠️ Response không hợp lệ, retry...`);
            retryCount++;
            if (retryCount < maxRetries) {
              await delayFn(1000);
            }
          }

        } catch (error) {
          console.warn(`❌ Error batch ${batchIdx + 1}:`, error.message);
          retryCount++;
          if (retryCount < maxRetries) {
            await delayFn(1000);
          }
        }
      }

      // PARSE RESPONSE (nếu có)
      if (responseText) {
        const lines = responseText.split('\n').filter(line => line.trim() && line.includes('|||'));
        
        lines.forEach(line => {
          const parts = line.split('|||');
          if (parts.length >= 2) {
            let sId = parts[0].trim();
            
            if (/^\d+$/.test(sId)) {
              const idx = parseInt(sId) - 1;
              const batchIds_ = Object.keys(batchData);
              if (idx >= 0 && idx < batchIds_.length) {
                sId = batchIds_[idx];
              }
            }
            
            let comment = parts.slice(1).join('|||').trim();
            
            if (isValidComment(comment) && Object.keys(batchData).includes(sId)) {
              comment = comment.replace(/\[.*?\]/g, '').trim();
              
              if (!comment.toLowerCase().startsWith('em')) {
                comment = 'Em ' + comment.charAt(0).toLowerCase() + comment.slice(1);
              }
              
              allUpdates[sId] = comment;
              totalSuccessCount++;
              console.log(`✅ ${sId}: ${comment.substring(0, 50)}...`);
            }
          }
        });
      }

      // FALLBACK: Dùng câu mẫu cho batch này nếu fail
      if (totalSuccessCount === Object.keys(allUpdates).length) {
        // Đã xử lý đủ, skip fallback
      } else {
        for (const sId of batchIds) {
          if (!allUpdates[sId]) {
            const data = basicComments[sId];
            if (data.comment) {
              allUpdates[sId] = data.comment;
              totalSuccessCount++;
            }
          }
        }
      }

      // Delay giữa batch
      if (batchIdx < batchCount - 1) {
        await delayFn(2000);
      }
    }

    // FINAL: Dùng câu mẫu cho những em chưa xử lý
    const finalUpdates = {};
    for (const [sId, data] of Object.entries(basicComments)) {
      finalUpdates[sId] = allUpdates[sId] || data.comment || 'Em có nỗ lực học tập và tiến bộ tích cực.';
      if (!allUpdates[sId] && data.comment) {
        totalSuccessCount++;
      }
    }

    setDraftData(prev => {
      const updated = { ...prev };
      for (const sId of Object.keys(finalUpdates)) {
        updated[sId] = {
          ...(prev[sId] || {}),
          comment: finalUpdates[sId]
        };
      }
      return updated;
    });

    setIsGenerating(false);
    showToast(`✅ Tạo nhận xét: ${totalSuccessCount}/${Object.keys(finalUpdates).length}`, 'success', '✅', 3000);
    console.log(`✅ Hoàn thành: ${totalSuccessCount}/${Object.keys(finalUpdates).length}`);

  } catch (e) { 
    console.error('❌ Lỗi:', e);
    showToast('❌ Lỗi: ' + e.message, 'error', '❌', 4000);
    setIsGenerating(false);
  }
};

  const handleSendZalo = (studentId) => {
    const d = studentData[studentId] || {};
    const draft = draftData[studentId] || {};
    const finalComment = draft.comment !== undefined ? draft.comment : (d.comment || "");
    const levelTxt = draft.level !== undefined ? draft.level : (d.level || "Đ");
    const stu = students.find(s => s.id === studentId);
    if (!stu) return;

    let label = "";
    if (systemMode === 'vnedu' && viewMode !== 'subject') {
      const list = viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES);
      label = list.find(c => c.id === selectedCriteriaId)?.name;
    } else label = viewMode === 'subject' ? subjects.find(s => s.id === selectedSubId)?.name : 'Năng lực - Phẩm chất';

    const monthName = months.find(m => m.id === selectedMonthId)?.name || 'tháng';
    const levelMap = { 'T': 'Hoàn thành tốt ⭐', 'H': 'Hoàn thành ✅', 'Đ': 'Đạt ✅', 'C': 'Cần cố gắng 📝' };
    const header = `🌸 THÔNG TIN ĐÁNH GIÁ THÁNG - ${monthName.toUpperCase()} 🌸`;
    const body = `Chào Phụ huynh em: *${stu.name.toUpperCase()}*\n\n📚 *Nội dung:* ${label}\n📊 *Mức đạt:* ${levelMap[levelTxt] || levelTxt}\n✏️ *Nhận xét:* ${finalComment || "Em học tập tích cực và có nhiều tiến bộ."}\n\n🍀 Chúc em luôn chăm ngoan và học tốt nhé!\n\n🌸Gia sư Tiểu học: https://roboki.vn/🌸`;
    const content = `${header}\n\n${body}`;

    copyToClipboard(content);
    setCopySuccess(studentId); 
    showToast(`Đã sao chép tin nhắn cho ${stu.name}`, 'success', '📋', 2000);
    setTimeout(() => setCopySuccess(null), 2000);
    window.open(`https://id.zalo.me/account?continue=https%3A%2F%2Fchat.zalo.me%2F`, '_blank');
  };

  const exportExcel = async () => {
    if (!students.length || !window.XLSX) {
      showToast('Không có học sinh nào để xuất', 'info', '⚠️', 3000);
      return;
    }
    try {
      const className = classes.find(c => c.id === selectedClassId)?.name || 'Lớp';
      const monthName = months.find(m => m.id === selectedMonthId)?.name || 'Tháng';
      let contentName = "";
      let dataRows = [];
      let headerColumns = ['STT', 'HỌ VÀ TÊN', 'TRẠNG THÁI'];
      
      if (viewMode === 'subject') {
        contentName = subjects.find(s => s.id === selectedSubId)?.name || "Môn học";
        headerColumns.push('MỨC ĐẠT');
      } else if (systemMode === 'vnedu') {
        const list = viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES);
        contentName = list.find(c => c.id === selectedCriteriaId)?.name || "Đánh giá";
        headerColumns.push('MỨC ĐẠT');
      } else if (systemMode === 'smas' && viewMode !== 'subject') {
        if (viewMode === 'quality') {
          contentName = "Phẩm chất";
          QUALITY_CRITERIA.forEach(c => headerColumns.push(c.name));
        } else if (viewMode === 'competency') {
          contentName = "NL Chung";
          GENERAL_COMPETENCIES.forEach(c => headerColumns.push(c.name));
        } else {
          contentName = "NL Đặc thù";
          SPECIFIC_COMPETENCIES.forEach(c => headerColumns.push(c.name));
        }
      }
      
      headerColumns.push('NHẬN XÉT CHI TIẾT');

      dataRows.push([`BẢNG NHẬN XÉT CHI TIẾT (${systemMode.toUpperCase()})`]);
      dataRows.push([`Lớp: ${className} - ${monthName}`]);
      dataRows.push([`Nội dung: ${contentName}`]);
      dataRows.push([]);
      dataRows.push(headerColumns);
      
      students.forEach((s, i) => {
        const d = studentData[s.id] || {};
        const draft = draftData[s.id] || {};
        const comment = draft.comment !== undefined ? draft.comment : (d.comment || "");
        const statusText = STUDENT_STATUS[s.status?.toUpperCase()]?.label || 'Đang học';
        
        let row = [i + 1, s.name.toUpperCase(), statusText];
        
        if (viewMode === 'subject') {
          const level = draft.level !== undefined ? draft.level : (d.level || "");
          row.push(level);
        } else if (systemMode === 'vnedu') {
          const level = draft.level !== undefined ? draft.level : (d.level || "");
          row.push(level);
        } else if (systemMode === 'smas' && viewMode !== 'subject') {
          const list = viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES);
          list.forEach(c => {
            const level = draft[`level_${c.id}`] !== undefined ? draft[`level_${c.id}`] : (d[`level_${c.id}`] || "");
            row.push(level);
          });
        }
        
        row.push(comment);
        dataRows.push(row);
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(dataRows);

      const border = { style: 'thin', color: { rgb: '000000' } };
      const borderAll = { top: border, bottom: border, left: border, right: border };
      const headerFill = { fgColor: { rgb: 'FF4472C4' } };
      const headerFont = { bold: true, color: { rgb: 'FFFFFFFF' }, size: 12 };

      ws['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: headerColumns.length - 1 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: headerColumns.length - 1 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: headerColumns.length - 1 } }
      ];

      for (let i = 0; i < dataRows.length; i++) {
        for (let j = 0; j < dataRows[i].length; j++) {
          const cellRef = XLSX.utils.encode_col(j) + (i + 1);
          if (!ws[cellRef]) ws[cellRef] = {};
          ws[cellRef].s = { border: borderAll };
          if (i === 4) {
            ws[cellRef].s.fill = headerFill;
            ws[cellRef].s.font = headerFont;
            ws[cellRef].s.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
          } else {
            const isFirstCol = j === 0;
            const isCenterCol = j >= 3 && j < headerColumns.length - 1;
            ws[cellRef].s.alignment = { horizontal: isFirstCol || isCenterCol ? 'center' : 'left', vertical: 'top', wrapText: true };
          }
        }
      }

      ws['!cols'] = [
        { wch: 6 }, { wch: 25 }, { wch: 18 },
        ...Array(headerColumns.length - 4).fill({ wch: 12 }),
        { wch: 60 }
      ];

      XLSX.utils.book_append_sheet(wb, ws, "NhanXet");
      XLSX.writeFile(wb, `NhanXet_${contentName}_${className}_${monthName}.xlsx`);
      showToast(`Xuất file Excel thành công`, 'success', '📥', 3000);
    } catch (e) {
      console.error(e);
      showToast('Lỗi xuất file: ' + e.message, 'error', '❌', 4000);
    }
  };

  // ===== RENDER =====
  if (!isAuthValid) return <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-black text-center">LỖI XÁC THỰC<br/>LIÊN HỆ: 0964567806</div>;

  if (!user) {
    return <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword} onLogin={handleLogin} toast={toast} />;
  }

  const draftCount = Object.keys(draftData).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-12 font-sans text-left flex flex-col w-full">
      {toast && <Toast message={toast.message} type={toast.type} icon={toast.icon} />}
      
      {/* HEADER */}
      <header className="bg-indigo-900 text-white p-2 md:p-3 shadow-xl border-b-2 border-indigo-700 w-full">
        <div className="w-full flex flex-col lg:flex-row justify-between items-center gap-6 px-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/20 rounded-xl">
              <img src="./logo.png" className="w-9 h-9" alt="Logo" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-black uppercase leading-none tracking-tight">ĐÁNH GIÁ THƯỜNG XUYÊN</h1>
              <span className="text-indigo-300 text-[11px] font-bold uppercase mt-1 italic tracking-wider">HỆ THỐNG ĐÁNH GIÁ TIỂU HỌC</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex bg-indigo-950/50 p-1 rounded-xl gap-1 items-center">
              {['smas', 'vnedu'].map(sys => (
                <button key={sys} onClick={() => { setSystemMode(sys); setSelectedCriteriaId(''); setDraftData({}); }} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase transition-all ${systemMode === sys ? 'bg-white text-indigo-900 shadow-lg' : 'text-indigo-300 hover:text-white'}`}>
                  🌐 {sys}
                </button>
              ))}
              <div className="w-px h-6 bg-indigo-700 mx-1"></div>
              <div className="flex items-center gap-1.5">
                <button onClick={handleSaveAllToFirebase} disabled={isSaving || draftCount === 0} className={`flex items-center gap-2 px-4 py-2.5 rounded-l-lg text-[11px] font-black uppercase transition-all shadow-md active:scale-95 ${draftCount > 0 ? 'bg-amber-500 text-white hover:bg-amber-600 animate-pulse' : 'bg-indigo-800 text-indigo-400 opacity-50 cursor-not-allowed'}`}>
                  {isSaving ? '⏳' : '💾'} Lưu ({draftCount})
                </button>
                <button onClick={() => setShowApiKeyModal(true)} className={`p-2.5 rounded-r-lg transition-all ${apiKey ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white animate-bounce'} shadow-md`}>
                  ⚙️
                </button>
              </div>
            </div>
            <div className="flex bg-indigo-950/50 p-1 rounded-xl gap-1 flex-wrap justify-center">
              {['subject', 'competency', 'quality', 'specific'].map(m => (
                <button key={m} onClick={() => { setViewMode(m); setSelectedCriteriaId(''); setDraftData({}); }} className={`px-4 py-2.5 rounded-lg text-[11px] font-black uppercase transition-all ${viewMode === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-indigo-300 hover:text-white'}`}>
                  {m === 'competency' ? 'NL Chung' : (m === 'subject' ? 'Môn học' : (m === 'quality' ? 'Phẩm chất' : 'NL Đặc thù'))}
                </button>
              ))}
            </div>
          </div>

          {/* USER MENU */}
          <div style={{ position:"absolute", top:"5px", left:"42px" }} onMouseLeave={()=>setShowUserMenu(false)}>
            <div onClick={() => setShowUserMenu(!showUserMenu)} style={{ background:"white", color:"#333", padding:"5px 8px", borderRadius:"6px", fontSize:"13px", fontWeight:"bold", boxShadow:"0 0 5px rgba(0,0,0,0.2)", cursor:"pointer" }}>
              👤 {user?.displayName || user?.email}
            </div>
            {showUserMenu && (
              <div style={{ position:"absolute", right:"0", top:"30px", background:"white", borderRadius:"6px", boxShadow:"0 2px 10px rgba(0,0,0,0.2)", fontSize:"13px", overflow:"hidden", zIndex: 100 }}>
                <div onClick={() => { handleChangeName(); setShowUserMenu(false); }} style={{ padding:"8px 12px", cursor:"pointer", color:"red", borderBottom: "1px solid #eee" }}>✏️ Đổi tên</div>
                <div onClick={() => { handleChangePassword(); setShowUserMenu(false); }} style={{ padding:"8px 12px", cursor:"pointer", color:"red", borderBottom: "1px solid #eee" }}>🔑 Đổi mật khẩu</div>
                <div onClick={() => { handleLogout(); setShowUserMenu(false); }} style={{ padding:"8px 12px", cursor:"pointer", color:"red" }}>🚪 Đăng xuất</div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* SELECTION */}
      <div className="w-full px-4 md:px-8 py-3 flex flex-wrap gap-10 items-stretch">
        <SectionBox label="📅 Năm học" items={years} selectedId={selectedYearId} onSelect={setSelectedYearId} onEdit={(item) => { setEditItem(item); setInputValue(item.name); setModalType('year'); }} onDelete={() => setConfirmDelete({ type: 'year', id: selectedYearId, name: years.find(y => y.id === selectedYearId)?.name })} onAdd={() => { setEditItem(null); setInputValue(''); setModalType('year'); }} type="year" />
        <SectionBox label="🏫 Lớp học" items={classes} selectedId={selectedClassId} onSelect={setSelectedClassId} onEdit={(item) => { setEditItem(item); setInputValue(item.name); setModalType('class'); }} onDelete={() => setConfirmDelete({ type: 'class', id: selectedClassId, name: classes.find(c => c.id === selectedClassId)?.name })} onAdd={() => { setEditItem(null); setInputValue(''); setModalType('class'); }} type="class" />
        <SectionBox label="📆 Tháng" items={months} selectedId={selectedMonthId} onSelect={setSelectedMonthId} onEdit={(item) => { setEditItem(item); setInputValue(item.name); setModalType('month'); }} onDelete={() => setConfirmDelete({ type: 'month', id: selectedMonthId, name: months.find(m => m.id === selectedMonthId)?.name })} onAdd={() => { setEditItem(null); setInputValue(''); setModalType('month'); }} type="month" />
        {viewMode === 'subject' ? (
          <SectionBox label="📚 Môn học" items={subjects} selectedId={selectedSubId} onSelect={setSelectedSubId} onEdit={(item) => { setEditItem(item); setInputValue(item.name); setModalType('subject'); }} onDelete={() => setConfirmDelete({ type: 'subject', id: selectedSubId, name: subjects.find(s => s.id === selectedSubId)?.name })} onAdd={() => { setEditItem(null); setInputValue(''); setModalType('subject'); }} type="subject" />
        ) : systemMode === 'vnedu' ? (
          <SectionBox label={viewMode === 'quality' ? '⭐ Chọn Phẩm chất' : (viewMode === 'competency' ? '🧠 Chọn NL Chung' : '👤 Chọn NL Đặc thù')} items={viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES)} selectedId={selectedCriteriaId} onSelect={setSelectedCriteriaId} onEdit={() => {}} onDelete={() => {}} onAdd={() => {}} type="system_comp" />
        ) : (
          <div className="bg-indigo-50 p-2 rounded-xl border-2 border-indigo-200 shadow-sm flex items-center justify-center font-black text-indigo-700 text-[10px] uppercase gap-2 flex-1 min-w-[140px]">
            {viewMode === 'specific' ? '⭐' : (viewMode === 'competency' ? '🧠' : '👤')}
            {viewMode === 'competency' ? 'NL CHUNG (SMAS)' : (viewMode === 'quality' ? 'PHẨM CHẤT (SMAS)' : 'NL ĐẶC THÙ (SMAS)')}
          </div>
        )}
      </div>

      {/* MAIN */}
      <main className="w-full px-4 md:px-8 flex-1">
        {selectedYearId && selectedClassId && selectedMonthId && (viewMode === 'subject' ? selectedSubId : (systemMode === 'vnedu' ? selectedCriteriaId : true)) ? (
          <div className="space-y-6 w-full">
            {/* CONTROLS */}
            <div className="bg-white rounded-2xl p-2 border-2 border-slate-300 shadow-sm flex flex-col gap-3 w-full">
              <div className="flex flex-col xl:flex-row gap-3 items-end">
                <div className="flex-1 w-full text-left">
                  <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Hướng dẫn AI</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 text-lg">✨</span>
                    <input className="w-full bg-slate-50 border-2 border-slate-300 rounded-xl pl-12 pr-4 py-4 text-sm font-semibold outline-none focus:border-indigo-500 transition-all" 
                      placeholder="VD: Cộng có nhớ| tìm số chia| giải toán| " 
                      value={aiPrompt} 
                      onChange={e => setAiPrompt(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-3 w-full xl:w-auto">
                  <button onClick={runAI} disabled={isGenerating || students.length === 0} className={`flex-1 xl:flex-none px-10 py-4 ${isGenerating ? 'bg-gray-500' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-xl font-black text-xs flex items-center justify-center gap-2 uppercase shadow-lg transition-all active:scale-95 disabled:opacity-50`}>
                    {isGenerating ? '⏳ Đang nhận xét...' : '✨ Nhận xét AI'}
                  </button>
                  <button onClick={() => { setEditItem(null); setBulkInput(''); setModalType('student'); }} className="p-4 bg-slate-800 text-white rounded-xl shadow-lg hover:bg-black transition-all active:scale-95 text-lg">👥</button>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-4">
                <div className="flex gap-3">
                  <button onClick={() => setShowLevel(!showLevel)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black uppercase transition-all border ${showLevel ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-200'}`}>
                    {showLevel ? '👁️' : '🚫'} Mức đạt
                  </button>
                  <button onClick={() => setShowNote(!showNote)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-black uppercase transition-all border ${showNote ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-400 border-slate-200'}`}>
                    {showNote ? '👁️' : '🚫'} Ghi chú
                  </button>
                </div>
                <button onClick={exportExcel} disabled={students.length === 0} className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg text-[11px] font-black uppercase hover:bg-emerald-700 shadow-md">
                  📥 Xuất Excel
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl border-2 border-slate-400 shadow-2xl overflow-hidden mb-12 w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full border-collapse table-fixed min-w-[1200px]">
                  <thead>
                    <tr className="bg-slate-200 border-b-2 border-slate-400">
                      <th className="p-4 text-center text-[10px] font-black uppercase w-20 border-r border-slate-400 sticky left-0 bg-slate-200 z-20">STT</th>
                      <th className="p-4 text-center text-[10px] font-black uppercase w-56 border-r border-slate-400 sticky left-20 bg-slate-200 z-20">Học sinh</th>
                      {(systemMode === 'smas' && viewMode !== 'subject') ? (
                        showLevel && (viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES)).map(c => <th key={c.id} className="p-2 text-center text-[9px] font-black uppercase border-r border-slate-400 w-20">{c.name}</th>)
                      ) : (
                        showLevel && <th className="p-4 text-center text-[10px] font-black uppercase w-32 border-r border-slate-400">Mức đạt</th>
                      )}
                      {showNote && <th className="p-4 text-center text-[10px] font-black uppercase w-48 border-r border-slate-400">Ghi chú</th>}
                      <th className="p-4 text-center text-[10px] font-black uppercase min-w-[400px]">Nhận xét</th>
                      <th className="p-4 w-20 text-center text-[10px] font-black uppercase border-l border-slate-400">Zalo</th>
                      <th className="p-4 w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-300">
                    {students.map((stu, idx) => {
                      const d = studentData[stu.id] || {};
                      const draft = draftData[stu.id] || {};
                      const finalComment = draft.comment !== undefined ? draft.comment : (d.comment || "");
                      const finalNote = draft.note !== undefined ? draft.note : (d.note || "");
                      const isInactive = stu.status && stu.status !== 'active';
                      const statusConfig = STUDENT_STATUS[stu.status?.toUpperCase()] || STUDENT_STATUS.ACTIVE;
                      const isDragging = draggedStudentId === stu.id;
                      const isDragOver = dragOverStudentId === stu.id;

                      return (
                        <tr 
                          key={stu.id} 
                          className={`transition-all draggable-row ${isInactive ? 'bg-slate-50' : 'hover:bg-indigo-50/50'} group`}>
                          
                          <td className={`p-3 text-center border-r border-slate-400 sticky left-0 z-10 ${isInactive ? 'text-slate-300 bg-slate-50' : 'text-slate-400 bg-slate-50'}`}>
                            <span className="text-xs font-bold">{idx + 1}</span>
                          </td>
                          
                          <td className="p-3 border-r border-slate-400 text-left sticky left-20 bg-inherit z-10">
                            <button 
                              draggable
                              onDragStart={(e) => handleDragStart(e, stu.id)}
                              onDragOver={(e) => handleDragOver(e, stu.id)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, stu.id)}
                              onClick={() => setStatusModalStudent(stu)} 
                              className={`flex flex-col items-start w-full text-left group/name relative cursor-move transition-all ${draggedStudentId === stu.id ? 'opacity-50 scale-95' : ''} ${dragOverStudentId === stu.id ? 'bg-indigo-200 px-2 py-1 rounded' : ''}`}
                            >
                              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-900 text-white text-[11px] rounded-lg whitespace-nowrap z-50 opacity-0 group-hover/name:opacity-100 transition-opacity pointer-events-none font-bold shadow-lg">
                                Cập nhật: {d.lastModified ? new Date(d.lastModified).toLocaleDateString('vi-VN') : 'N/A'}
                              </div>
                              <span className={`font-black text-sm uppercase transition-all ${isInactive ? 'text-slate-400 line-through' : 'text-slate-800 group-hover/name:text-indigo-600'}`}>
                                {stu.name}
                              </span>
                              {isInactive && (
                                <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded mt-1 ${statusConfig.bg} ${statusConfig.color}`}>
                                  {statusConfig.label}
                                </span>
                              )}
                            </button>
                          </td>

                          {/* CÁC TD KHÁC GIỮ NGUYÊN */}
                          {(systemMode === 'smas' && viewMode !== 'subject') ? (
                            showLevel && (viewMode === 'quality' ? QUALITY_CRITERIA : (viewMode === 'competency' ? GENERAL_COMPETENCIES : SPECIFIC_COMPETENCIES)).map(c => {
                              const lvVal = draft[`level_${c.id}`] !== undefined ? draft[`level_${c.id}`] : (d[`level_${c.id}`] || "");
                              return (
                                <td key={c.id} className="p-1 border-r border-slate-400">
                                  <div className="flex justify-center gap-0.5">
                                    {['T', 'Đ', 'C'].map(lv => (
                                      <button disabled={isInactive} key={lv} onClick={() => updateDraft(stu.id, `level_${c.id}`, lv)} className={`w-5 h-6 rounded font-black text-[9px] ${lvVal === lv ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'} disabled:opacity-20`}>{lv}</button>
                                    ))}
                                  </div>
                                </td>
                              );
                            })
                          ) : (
                            showLevel && (
                              <td className="p-3 border-r border-slate-400">
                                <div className="flex justify-center gap-1">
                                  {(viewMode === 'subject' ? ['T', 'H', 'C'] : ['T', 'Đ', 'C']).map(lv => {
                                    const lvVal = draft.level !== undefined ? draft.level : (d.level || "");
                                    return (
                                      <button disabled={isInactive} key={lv} onClick={() => updateDraft(stu.id, 'level', lv)} className={`w-8 h-8 rounded-lg font-black text-[10px] ${lvVal === lv ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'} disabled:opacity-20`}>{lv}</button>
                                    );
                                  })}
                                </div>
                              </td>
                            )
                          )}
                          
                          {showNote && <td className="p-2 border-r border-slate-400 align-top"><EditableCell disabled={isInactive} value={finalNote} isDraft={draft.note !== undefined} onSave={(val) => updateDraft(stu.id, 'note', val)} className="bg-transparent text-xs font-bold text-indigo-700 outline-none" /></td>}
                          
                          <td className="p-2 text-left align-top">
                            <EditableCell disabled={isInactive} value={finalComment} isDraft={draft.comment !== undefined} onSave={(val) => updateDraft(stu.id, 'comment', val)} className="bg-transparent text-sm font-medium text-slate-700 leading-relaxed" />
                          </td>
                          
                          <td className="p-3 text-center border-l border-slate-400">
                            <button disabled={!finalComment || isInactive} onClick={() => handleSendZalo(stu.id)} className={`p-2.5 rounded-full mx-auto transition-all ${copySuccess === stu.id ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white disabled:opacity-20'}`}>
                              {copySuccess === stu.id ? '✅' : <ZaloIcon size={18} />}
                            </button>
                          </td>
                          
                          <td className="p-3 text-center"><button onClick={() => setConfirmDelete({ type: 'student', id: stu.id, name: stu.name })} className="text-slate-200 hover:text-red-500 text-lg">🗑️</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : <div className="py-32 text-center bg-white rounded-3xl border-4 border-dashed border-slate-300 font-black text-slate-300 uppercase tracking-[0.2em] text-xl">Chọn đủ dữ liệu để bắt đầu</div>}
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full px-8 py-1 bg-white border-t border-slate-200 z-50">
        <div className="flex justify-between items-center text-[11px] text-slate-500">
          <div>© {new Date().getFullYear()} • {AUTHOR_NAME} • {AUTHOR_PHONE}</div>
          <div className="text-right italic normal-case">* Thầy/Cô vui lòng kiểm tra lại dữ liệu AI trước khi lưu.</div>
        </div>
      </footer>

      {/* MODALS */}
      {statusModalStudent && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl border-t-8 border-indigo-600">
            {!showMoveTargetSelect ? (
              <>
                <h3 className="text-lg font-black uppercase text-slate-800 mb-2">Trạng thái học sinh</h3>
                <p className="text-sm font-bold text-indigo-600 uppercase mb-8">{statusModalStudent.name}</p>
                <div className="grid grid-cols-1 gap-3">
                  {Object.keys(STUDENT_STATUS).map(key => {
                    const status = STUDENT_STATUS[key];
                    return (
                      <button 
                        key={status.id}
                        onClick={() => handleUpdateStatus(statusModalStudent.id, status.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${statusModalStudent.status === status.id ? 'bg-indigo-50 border-indigo-600' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                      >
                        <div className={`p-2 rounded-xl ${statusModalStudent.status === status.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 group-hover:text-indigo-600 shadow-sm'}`}>
                          {status.id === 'active' ? '✅' : status.id === 'dropped' ? '❌' : status.id === 'transferred' ? '✈️' : '➡️'}
                        </div>
                        <span className={`font-black text-xs uppercase ${statusModalStudent.status === status.id ? 'text-indigo-900' : 'text-slate-500'}`}>
                          {status.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setStatusModalStudent(null)} className="w-full mt-8 py-4 font-black text-slate-400 uppercase text-[10px]">Đóng</button>
              </>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setShowMoveTargetSelect(false)} className="p-2 -ml-2 text-slate-400 hover:text-indigo-600 text-xl">✕</button>
                  <h3 className="text-lg font-black uppercase text-slate-800">Chọn lớp chuyển đến</h3>
                </div>
                <div className="max-h-80 overflow-y-auto space-y-2 mb-8">
                  {classes.filter(c => c.id !== selectedClassId).map(cls => (
                    <button key={cls.id} disabled={isMoving} onClick={() => handleMoveStudentToClass(cls.id)} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all">
                      <span className="font-black text-sm uppercase">{cls.name}</span>
                      <span className="text-lg">→</span>
                    </button>
                  ))}
                </div>
                {isMoving && <div className="flex items-center justify-center gap-3 py-4 text-indigo-600 font-black text-[10px] uppercase">⏳ Đang di chuyển...</div>}
                <button disabled={isMoving} onClick={() => setShowMoveTargetSelect(false)} className="w-full py-4 font-black text-slate-400 uppercase text-[10px]">Quay lại</button>
              </div>
            )}
          </div>
        </div>
      )}

      {showApiKeyModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl border-t-8 border-emerald-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl text-2xl">🔑</div>
              <h3 className="text-xl font-black uppercase text-slate-800">API KEY GROP</h3>
            </div>
            <p className="text-sm text-slate-600 mb-4">Liên hệ: <a href="https://groq.com/" className="text-blue-600 underline">Vui lòng nháy vào đây lấy API Key</a></p>
            <input type="password" className="w-full p-4 bg-slate-50 border-2 border-slate-300 rounded-xl mb-6 font-mono text-sm outline-none" placeholder="Nhập API Key..." value={apiKey} onChange={e => setApiKey(e.target.value)} />
            <div className="flex gap-4">
              <button onClick={() => setShowApiKeyModal(false)} className="flex-1 py-4 font-black text-slate-400 uppercase text-[10px]">Đóng</button>
              <button onClick={() => saveApiKey(apiKey)} className="flex-[2] py-4 bg-emerald-600 text-white font-black rounded-xl uppercase text-[10px]">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl border-t-8 border-indigo-600">
            <h3 className="text-xl font-black uppercase text-slate-800 mb-6">{editItem ? "Sửa" : "Thêm"} {modalType === 'student' ? 'Học sinh' : 'Thông tin'}</h3>
            {modalType === 'student' ? 
              <textarea autoFocus className="w-full h-64 p-4 bg-slate-50 border-2 border-slate-300 rounded-xl mb-6 font-bold outline-none" placeholder="Danh sách tên (1 tên/dòng)..." value={bulkInput} onChange={e => setBulkInput(e.target.value)}/> 
              : 
              <input autoFocus className="w-full p-4 bg-slate-50 border-2 border-slate-300 rounded-xl font-bold mb-6 outline-none" value={inputValue} onChange={e => setInputValue(e.target.value)}/>
            }
            <div className="flex gap-4">
              <button onClick={() => setModalType(null)} className="flex-1 py-4 font-black text-slate-400 uppercase text-[10px]">Đóng</button>
              <button onClick={async () => {
                try {
                  if (modalType === 'student') {
                    const names = bulkInput.split('\n').map(n => n.trim()).filter(n => n !== '');
                    const col = db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years').doc(selectedYearId)
                      .collection('classes').doc(selectedClassId).collection('students');
                    for (const name of names) {
                      await col.add({ name, status: 'active', createdAt: Date.now() });
                    }
                    showToast(`Đã thêm ${names.length} học sinh thành công`, 'success', '✅', 3000);
                  } else {
                    const colName = modalType === 'year' ? 'years' : modalType === 'class' ? 'classes' : modalType === 'month' ? 'months' : 'subjects';
                    const col = db.collection('artifacts').doc(appId).collection('public').doc('data').collection(colName);
                    if (editItem) {
                      await col.doc(editItem.id).update({ name: inputValue });
                      showToast('Cập nhật thành công', 'success', '✅', 3000);
                    } else {
                      await col.add({ name: inputValue, createdAt: Date.now() });
                      showToast('Thêm mới thành công', 'success', '✅', 3000);
                    }
                  }
                  setInputValue(''); 
                  setBulkInput(''); 
                  setModalType(null);
                } catch (e) {
                  showToast('Lỗi: ' + e.message, 'error', '❌', 4000);
                }
              }} className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-xl uppercase text-[10px]">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl border-t-8 border-red-600">
            <h3 className="text-lg font-black mb-2 uppercase">Xác nhận xóa</h3>
            <p className="text-slate-500 text-sm mb-6">Xóa <span className="text-red-600 font-bold">"{confirmDelete.name}"</span>?</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-4 font-black text-slate-400 uppercase text-[10px]">Hủy</button>
              <button onClick={async () => {
                try {
                  if (confirmDelete.type === 'student') {
                    await db.collection('artifacts').doc(appId).collection('public').doc('data').collection('years').doc(selectedYearId)
                      .collection('classes').doc(selectedClassId).collection('students').doc(confirmDelete.id).delete();
                  } else {
                    const colName = confirmDelete.type === 'year' ? 'years' : confirmDelete.type === 'class' ? 'classes' : confirmDelete.type === 'month' ? 'months' : 'subjects';
                    await db.collection('artifacts').doc(appId).collection('public').doc('data').collection(colName).doc(confirmDelete.id).delete();
                  }
                  setConfirmDelete(null);
                  showToast('Xóa thành công', 'success', '✅', 3000);
                } catch (e) {
                  showToast('Lỗi xóa: ' + e.message, 'error', '❌', 4000);
                }
              }} className="flex-1 py-4 bg-red-600 text-white font-black rounded-xl uppercase text-[10px]">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
