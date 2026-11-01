import { useState, useEffect, type ChangeEvent } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Dumbbell, 
  ChevronLeft, 
  ChevronRight, 
  Zap, 
  ClipboardList, 
  Edit3, 
  Moon, 
  Sun, 
  RotateCcw, 
  Info,
  Utensils,
  X,
  Download,
  Upload,
  HardDrive,
  Smartphone
} from 'lucide-react';

type TrainingCategory = 'running' | 'bouldering' | 'hybrid' | 'rest';

type ChecklistTask = {
  id: string;
  text: string;
  completed: boolean;
};

type TrainingDay = {
  id: string;
  dayName: string;
  title: string;
  category: TrainingCategory;
  target: string;
  meals: {
    pre: string;
    post: string;
    hydration: string;
  };
  tasks: ChecklistTask[];
  nutritionTasks: ChecklistTask[];
  notes: string;
};

type TrainingWeek = {
  weekNumber: number;
  phase: number;
  phaseTitle: string;
  phaseDesc: string;
  days: TrainingDay[];
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

// Default 20-Week Training Schedule Blueprint with Integrated Nutrition
const generateInitialSchedule = (): TrainingWeek[] => {
  const weeks: TrainingWeek[] = [];
  
  for (let w = 1; w <= 20; w++) {
    let phase = 1;
    let phaseTitle = "Phase 1: Base Building";
    let phaseDesc = "Adapt joints & tendon capacity. Keep heart rate low (Zone 2).";
    let longRunKm = Math.min(5 + Math.floor((w - 1) * 0.8), 18);

    if (w >= 7 && w <= 13) {
      phase = 2;
      phaseTitle = "Phase 2: Endurance & Volume";
      phaseDesc = "Push stamina and introduce tempo/hills on the treadmill.";
      longRunKm = 8 + (w - 7) * 1.5;
    } else if (w >= 14 && w <= 18) {
      phase = 3;
      phaseTitle = "Phase 3: Peak Distance";
      phaseDesc = "Peak long run (up to 19km). Moderate climbing intensity to save fingers.";
      longRunKm = 14 + (w - 14) * 1.25;
      if (w === 17) longRunKm = 19;
      if (w === 18) longRunKm = 16;
    } else if (w >= 19) {
      phase = 4;
      phaseTitle = "Phase 4: Taper & Race Prep";
      phaseDesc = "Shed fatigue. Light runs, rest, and minimal climbing before race day!";
      longRunKm = w === 19 ? 10 : 5;
    }

    const easyRunKm = Math.min(4 + Math.floor(w / 4), 7);
    const tempoKm = Math.min(5 + Math.floor(w / 3), 9);

    const days: TrainingDay[] = [
      {
        id: `w${w}-d1`,
        dayName: "Monday",
        title: "Rest & Active Recovery",
        category: "rest",
        target: "Full body rest or foam rolling",
        meals: {
          pre: "Morning Shake: 5g Creatine + 1 scoop Whey Protein + 40g Fine Grain Oats",
          post: "Mediterranean chicken or chickpea salad with olive oil & feta",
          hydration: "2.5L Water + 1 Cup Chamomile / Herbal Tea"
        },
        tasks: [
          { id: "t1", text: "8+ hours of quality sleep", completed: false },
          { id: "t2", text: "15 min gentle mobility/foam rolling", completed: false },
          { id: "t3", text: "Hydrate: 2.5L - 3L water", completed: false }
        ],
        nutritionTasks: [
          { id: "nt1", text: "Take 5g Creatine Monohydrate with morning oats", completed: false },
          { id: "nt2", text: "Hit ~130g-140g baseline protein target", completed: false }
        ],
        notes: ""
      },
      {
        id: `w${w}-d2`,
        dayName: "Tuesday",
        title: `Easy Treadmill Run (${easyRunKm} km)`,
        category: "running",
        target: `Zone 2 HR (130 - 145 bpm) @ 1.0% Incline`,
        meals: {
          pre: "60m Pre-Run: 30g Fine Oats in water + 1/2 scoop Whey (light fuel)",
          post: "Within 45m Post-Run: 1 Scoop Whey + 50g Fine Oats + 5g Creatine",
          hydration: "3.0L Water + Pinch of sea salt in morning glass"
        },
        tasks: [
          { id: "t1", text: "Dynamic legs & calf warm-up (5 mins)", completed: false },
          { id: "t2", text: `Run ${easyRunKm} km @ Easy Conversational Pace`, completed: false },
          { id: "t3", text: "Treadmill set to 1.0% incline", completed: false },
          { id: "t4", text: "Post-run hamstring & hip flexor stretch", completed: false }
        ],
        nutritionTasks: [
          { id: "nt1", text: "Pre-run fine oats fuel 60m before treadmill", completed: false },
          { id: "nt2", text: "Post-run Whey + Fine Oats + 5g Creatine within 45m", completed: false }
        ],
        notes: ""
      },
      {
        id: `w${w}-d3`,
        dayName: "Wednesday",
        title: "Bouldering (Technical / Volume)",
        category: "bouldering",
        target: "Moderate grades, footwork focus, save fingers",
        meals: {
          pre: "45m Pre-Climb: 10g Collagen + 30g Fine Oats + 5g Creatine",
          post: "Within 60m Post-Climb: 1 Scoop Whey Protein + rice/quinoa bowl",
          hydration: "2.5L - 3L Water (Keep sip bottle on gym floor)"
        },
        tasks: [
          { id: "t1", text: "Finger & wrist mobility warm-up on jugs", completed: false },
          { id: "t2", text: "60-90 min bouldering session (Flash grade - 1)", completed: false },
          { id: "t3", text: "Core conditioning: 3x12 Hanging Leg Raises", completed: false },
          { id: "t4", text: "Antagonist wrist extension band work", completed: false }
        ],
        nutritionTasks: [
          { id: "nt1", text: "Take 5g Creatine + Collagen 45m before climbing", completed: false },
          { id: "nt2", text: "Post-climb Whey protein for forearm muscle repair", completed: false }
        ],
        notes: ""
      },
      {
        id: `w${w}-d4`,
        dayName: "Thursday",
        title: `Treadmill Tempo (${Math.round(tempoKm)} km) + Gym Strength`,
        category: "hybrid",
        target: "Speed endurance + Quad & Calf bulletproofing",
        meals: {
          pre: "90m Pre-Workout: 50g Fine Oats + 1 scoop Whey Protein in water",
          post: "Immediate Post-Gym: 1 Scoop Whey + 5g Creatine + banana",
          hydration: "3.0L - 3.5L Water (Electrolyte drink during gym session)"
        },
        tasks: [
          { id: "t1", text: `1km Easy + 4-6x Intervals @ Zone 4 + 1km Cooldown`, completed: false },
          { id: "t2", text: "Leg Press or Barbell Squats (3x8-10)", completed: false },
          { id: "t3", text: "Single-Leg Dumbbell Calf Raises (3x12 per leg)", completed: false },
          { id: "t4", text: "Romanian Deadlifts (3x10)", completed: false }
        ],
        nutritionTasks: [
          { id: "nt1", text: "Whey + Fine Oats pre-workout fuel", completed: false },
          { id: "nt2", text: "Post-strength 5g Creatine + Whey shake", completed: false }
        ],
        notes: ""
      },
      {
        id: `w${w}-d5`,
        dayName: "Friday",
        title: "Rest or Light Mobility",
        category: "rest",
        target: "Prepare legs for weekend long run",
        meals: {
          pre: "Morning: 5g Creatine + 1 scoop Whey Protein in morning smoothie",
          post: "Carb Prep Dinner: Pasta/rice bowl with chicken & veggies",
          hydration: "3.0L Water (Fully hydrate before Saturday long run)"
        },
        tasks: [
          { id: "t1", text: "Full upper body & ankle stretches", completed: false },
          { id: "t2", text: "Carb-focused meal for long run fuel", completed: false },
          { id: "t3", text: "Optional 20 min easy walk", completed: false }
        ],
        nutritionTasks: [
          { id: "nt1", text: "Daily 5g Creatine taken with breakfast/protein", completed: false },
          { id: "nt2", text: "Increase complex carbohydrate intake by 20%", completed: false }
        ],
        notes: ""
      },
      {
        id: `w${w}-d6`,
        dayName: "Saturday",
        title: `Long Treadmill Run (${Math.round(longRunKm)} km)`,
        category: "running",
        target: "Aerobic stamina & mental endurance (Zone 2)",
        meals: {
          pre: "90m Pre-Run: 50g Fine Oats + honey + coffee (Low fat)",
          post: "Immediate Post-Run: 1 Scoop Whey + 5g Creatine + large banana + electrolyte water",
          hydration: "3.5L Water total + 1-2 Electrolyte tabs"
        },
        tasks: [
          { id: "t1", text: "Pre-run electrolyte drink & light snack", completed: false },
          { id: "t2", text: `Complete ${Math.round(longRunKm)} km steady run on treadmill`, completed: false },
          { id: "t3", text: "Vary incline 1.0% - 2.5% every 2-3 km", completed: false },
          { id: "t4", text: "Post-run 15 min leg elevation & stretching", completed: false }
        ],
        nutritionTasks: [
          { id: "nt1", text: "Fine oats carb fuel 90m before long run", completed: false },
          { id: "nt2", text: "Post-run Whey + 5g Creatine + electrolytes immediately after", completed: false }
        ],
        notes: ""
      },
      {
        id: `w${w}-d7`,
        dayName: "Sunday",
        title: "Bouldering (Projecting / Fun)",
        category: "bouldering",
        target: "Limit bouldering & problem solving",
        meals: {
          pre: "Pre-Climb: 40g Fine Oats + 1 scoop Whey + 5g Creatine",
          post: "Post-Climb: High-protein dinner (Grilled steak/chicken & quinoa)",
          hydration: "2.5L - 3.0L Water"
        },
        tasks: [
          { id: "t1", text: "Full body dynamic warm-up", completed: false },
          { id: "t2", text: "60 min projecting session (Stop before total grip fatigue)", completed: false },
          { id: "t3", text: "Post-climb forearm massage & finger stretch", completed: false }
        ],
        nutritionTasks: [
          { id: "nt1", text: "Pre-climb 5g Creatine + Whey + Fine Oats fuel", completed: false },
          { id: "nt2", text: "Tendon health supplement (Collagen or Vit C)", completed: false }
        ],
        notes: ""
      }
    ];

    weeks.push({
      weekNumber: w,
      phase,
      phaseTitle,
      phaseDesc,
      days
    });
  }

  return weeks;
};

export default function App() {
  const [schedule, setSchedule] = useState<TrainingWeek[]>(() => {
    const saved = localStorage.getItem('hm_boulder_tracker_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return generateInitialSchedule();
  });

  const [currentWeekNum, setCurrentWeekNum] = useState(1);
  const [selectedDay, setSelectedDay] = useState<TrainingDay | null>(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [nutritionGuideOpen, setNutritionGuideOpen] = useState(false);
  const [tempNoteText, setTempNoteText] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  // PWA installation state & registration
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(err => {
          console.error('Service Worker registration failed: ', err);
        });
      });
    }

    // Listen for install prompt event
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPWA = async () => {
    const installPrompt = deferredPrompt;
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  useEffect(() => {
    localStorage.setItem('hm_boulder_tracker_data', JSON.stringify(schedule));
  }, [schedule]);

  // Export progress as JSON file
  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(schedule, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `hybrid_tracker_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import progress from local JSON backup
  const importData = (event: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.currentTarget.files?.[0];
    if (file) {
      fileReader.readAsText(file, "UTF-8");
      fileReader.onload = () => {
        try {
          const result = fileReader.result;
          if (typeof result !== 'string') {
            console.error("Unable to read backup file");
            return;
          }
          const parsed = JSON.parse(result);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSchedule(parsed as TrainingWeek[]);
          }
        } catch (err) {
          console.error("Invalid JSON format", err);
        }
      };
    }
  };

  const currentWeek = schedule.find((week) => week.weekNumber === currentWeekNum) ?? schedule[0];
  const weeklyTasks = currentWeek.days.flatMap((day) => [...day.tasks, ...day.nutritionTasks]);
  const weekProgress = weeklyTasks.length
    ? Math.round((weeklyTasks.filter((task) => task.completed).length / weeklyTasks.length) * 100)
    : 0;

  const handleReset = () => {
    if (!window.confirm('Reset all training progress? This cannot be undone.')) return;
    setSchedule(generateInitialSchedule());
    setCurrentWeekNum(1);
    setSelectedDay(null);
    setNoteModalOpen(false);
  };

  const openNoteModal = (day: TrainingDay) => {
    setSelectedDay(day);
    setTempNoteText(day.notes);
    setNoteModalOpen(true);
  };

  const saveNote = () => {
    if (!selectedDay) return;
    setSchedule((previousSchedule) =>
      previousSchedule.map((week) => ({
        ...week,
        days: week.days.map((day) =>
          day.id === selectedDay.id ? { ...day, notes: tempNoteText } : day
        ),
      }))
    );
    setNoteModalOpen(false);
    setSelectedDay(null);
  };

  const handleToggleTask = (dayId: string, taskId: string) => {
    setSchedule((previousSchedule) =>
      previousSchedule.map((week) => ({
        ...week,
        days: week.days.map((day) =>
          day.id === dayId
            ? {
                ...day,
                tasks: day.tasks.map((task) =>
                  task.id === taskId ? { ...task, completed: !task.completed } : task
                ),
              }
            : day
        ),
      }))
    );
  };

  const handleToggleNutritionTask = (dayId: string, taskId: string) => {
    setSchedule((previousSchedule) =>
      previousSchedule.map((week) => ({
        ...week,
        days: week.days.map((day) =>
          day.id === dayId
            ? {
                ...day,
                nutritionTasks: day.nutritionTasks.map((task) =>
                  task.id === taskId ? { ...task, completed: !task.completed } : task
                ),
              }
            : day
        ),
      }))
    );
  };

  const categoryStyles = {
    running: "border-l-4 border-amber-500 bg-amber-500/10 text-amber-500",
    bouldering: "border-l-4 border-cyan-500 bg-cyan-500/10 text-cyan-500",
    hybrid: "border-l-4 border-emerald-500 bg-emerald-500/10 text-emerald-500",
    rest: "border-l-4 border-slate-500 bg-slate-500/10 text-slate-400"
  };

  const categoryBadges = {
    running: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    bouldering: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
    hybrid: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    rest: "bg-slate-500/20 text-slate-400 border border-slate-500/30"
  };

  const phaseButtons = [
    { id: 1, label: "Phase 1: Base Building", weeks: "Weeks 1-6" },
    { id: 2, label: "Phase 2: Endurance", weeks: "Weeks 7-13" },
    { id: 3, label: "Phase 3: Peak Distance", weeks: "Weeks 14-18" },
    { id: 4, label: "Phase 4: Taper", weeks: "Weeks 19-20" },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} font-sans pb-12`}>
      
      {/* Top Header */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-amber-500 to-cyan-500 rounded-xl text-slate-950 shadow-lg">
              <Zap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
                Half Marathon & Bouldering
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">
                  April 2027 Goal
                </span>
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">72kg • 30 yo • Treadmill & Gym Strength Hybrid Tracker</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {isInstallable && (
              <button
                onClick={handleInstallPWA}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all animate-pulse"
              >
                <Smartphone className="w-4 h-4" />
                <span>Install App</span>
              </button>
            )}

            <button
              onClick={exportData}
              className={`p-2 rounded-lg border transition-colors ${darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'}`}
              title="Backup Data (Export JSON)"
            >
              <Download className="w-4 h-4" />
            </button>

            <label
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-700'}`}
              title="Restore Data (Import JSON)"
            >
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>

            <button
              onClick={() => setNutritionGuideOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Utensils className="w-4 h-4" />
              <span className="hidden sm:inline">Macro & Nutrition Guide</span>
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition-colors ${darkMode ? 'border-slate-800 hover:bg-slate-800 text-amber-400' : 'border-slate-200 hover:bg-slate-100 text-slate-700'}`}
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleReset}
              className={`p-2 rounded-lg border transition-colors ${darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}
              title="Reset All Data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Local Storage Indicator Banner */}
        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-emerald-400" />
            <span>Local Storage Active: All data is saved automatically on this device.</span>
          </div>
          <span className="text-[10px] text-slate-500">Offline PWA ready</span>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {phaseButtons.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  const firstWeekOfPhase = p.id === 1 ? 1 : p.id === 2 ? 7 : p.id === 3 ? 14 : 19;
                  setCurrentWeekNum(firstWeekOfPhase);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  currentWeek.phase === p.id 
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                    : darkMode 
                      ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-800' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{p.label}</span>
                <span className="opacity-60 text-[10px] font-normal">({p.weeks})</span>
              </button>
            ))}
          </div>

          {/* Week Selector Carousel Bar */}
          <div className="flex items-center justify-between border-t border-b py-3 border-slate-800/40">
            <button
              onClick={() => setCurrentWeekNum(prev => Math.max(1, prev - 1))}
              disabled={currentWeekNum === 1}
              className={`p-2 rounded-xl border transition-all ${
                currentWeekNum === 1 
                  ? 'opacity-40 cursor-not-allowed border-transparent' 
                  : darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 overflow-x-auto py-1 max-w-[70vw] sm:max-w-none no-scrollbar">
              {schedule.map(w => (
                <button
                  key={w.weekNumber}
                  onClick={() => setCurrentWeekNum(w.weekNumber)}
                  className={`flex flex-col items-center justify-center min-w-[44px] h-12 rounded-xl text-xs font-bold transition-all ${
                    w.weekNumber === currentWeekNum
                      ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 shadow-md scale-105'
                      : darkMode
                        ? 'bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="text-[10px] font-normal opacity-80">WK</span>
                  <span>{w.weekNumber}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentWeekNum(prev => Math.min(20, prev + 1))}
              disabled={currentWeekNum === 20}
              className={`p-2 rounded-xl border transition-all ${
                currentWeekNum === 20 
                  ? 'opacity-40 cursor-not-allowed border-transparent' 
                  : darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Current Week Detail Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">Week {currentWeek.weekNumber}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-amber-500/20 font-semibold">
                  {currentWeek.phaseTitle}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{currentWeek.phaseDesc}</p>
            </div>

            {/* Weekly Completion Bar */}
            <div className="sm:w-64 bg-slate-800/40 p-3 rounded-xl border border-slate-800/60">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Weekly Completion</span>
                <span className="font-bold text-amber-400">{weekProgress}%</span>
              </div>
              <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${weekProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Daily Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentWeek.days.map((day) => {
            const isDayComplete = day.tasks.every(t => t.completed);

            return (
              <div
                key={day.id}
                className={`rounded-2xl border transition-all duration-200 flex flex-col ${
                  darkMode 
                    ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700' 
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                } ${isDayComplete ? 'ring-1 ring-emerald-500/30' : ''}`}
              >
                
                {/* Card Header */}
                <div className="p-4 border-b border-slate-800/40 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {day.dayName}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${categoryBadges[day.category]}`}>
                        {day.category}
                      </span>
                    </div>
                    <h3 className="text-base font-bold mt-1 text-slate-100 dark:text-slate-100 flex items-center gap-2">
                      {day.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => openNoteModal(day)}
                    className={`p-2 rounded-lg transition-colors ${
                      day.notes 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                        : darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
                    }`}
                    title={day.notes ? "Edit Workout Log / Notes" : "Add Workout Log / Notes"}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* Target Metric Highlight */}
                <div className={`mx-4 mt-3 px-3 py-2 rounded-xl text-xs font-medium ${categoryStyles[day.category]}`}>
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Info className="w-3.5 h-3.5" />
                    <span>Target & Strategy:</span>
                  </div>
                  <div className="mt-0.5 font-normal text-slate-300">{day.target}</div>
                </div>

                {/* Training Checklist */}
                <div className="p-4 space-y-2.5 flex-1">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5 text-amber-400" /> Training Checklist
                  </div>
                  {day.tasks.map((task) => (
                    <label
                      key={task.id}
                      onClick={() => handleToggleTask(day.id, task.id)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer select-none transition-colors border ${
                        task.completed 
                          ? darkMode 
                            ? 'bg-emerald-950/20 border-emerald-900/30 text-slate-400 line-through' 
                            : 'bg-emerald-50 border-emerald-200 text-slate-500 line-through'
                          : darkMode 
                            ? 'bg-slate-800/40 border-slate-800 hover:bg-slate-800 text-slate-200' 
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="mt-0.5">
                        {task.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </div>
                      <span className="text-xs leading-relaxed">{task.text}</span>
                    </label>
                  ))}
                </div>

                {/* Meal & Recovery Section */}
                <div className="px-4 py-3 bg-slate-950/40 border-t border-slate-800/40 space-y-2 rounded-b-2xl">
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5" /> Recovery Fueling
                  </div>
                  
                  {day.meals && (
                    <div className="text-xs space-y-1 text-slate-300">
                      <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                        <span className="font-semibold text-amber-400">Pre: </span>
                        <span>{day.meals.pre}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                        <span className="font-semibold text-emerald-400">Post: </span>
                        <span>{day.meals.post}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-900/70 border border-slate-800">
                        <span className="font-semibold text-cyan-400">Hydration: </span>
                        <span>{day.meals.hydration}</span>
                      </div>
                    </div>
                  )}

                  {/* Nutrition Checklist */}
                  <div className="pt-1 space-y-1">
                    {(day.nutritionTasks || []).map((ntask) => (
                      <label
                        key={ntask.id}
                        onClick={() => handleToggleNutritionTask(day.id, ntask.id)}
                        className={`flex items-start gap-2 p-1.5 rounded-lg cursor-pointer select-none transition-colors text-xs ${
                          ntask.completed 
                            ? 'text-slate-400 line-through bg-emerald-950/10' 
                            : 'text-slate-300 bg-slate-900/40 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="mt-0.5">
                          {ntask.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          )}
                        </div>
                        <span className="text-[11px]">{ntask.text}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Display Saved Log Note if Exists */}
                {day.notes && (
                  <div className="mx-4 mb-4 mt-2 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs">
                    <div className="text-amber-400 font-semibold mb-1 flex items-center gap-1">
                      <ClipboardList className="w-3.5 h-3.5" /> Logged Notes:
                    </div>
                    <p className="text-slate-300 italic whitespace-pre-wrap">{day.notes}</p>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </main>

      {/* Note / Log Workout Modal Dialog */}
      {noteModalOpen && selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-500" /> Log Workout Details
                </h3>
                <p className="text-xs text-slate-400">{selectedDay.dayName} - {selectedDay.title}</p>
              </div>
              <button 
                onClick={() => setNoteModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Workout Notes (Treadmill speeds, HR bpm, boulder grades, feeling):
              </label>
              <textarea
                value={tempNoteText}
                onChange={(e) => setTempNoteText(e.target.value)}
                placeholder="E.g., Ran 6km @ 9.5 km/h, avg HR 138 bpm. Sent V4 flash on 45-degree wall. Felt great!"
                rows={5}
                className={`w-full rounded-xl p-3 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none border ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setNoteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-800 text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={saveNote}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
              >
                Save Workout Log
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Nutrition Reference Modal */}
      {nutritionGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border p-6 shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold">Hybrid Athlete Nutrition Guide (72kg)</h3>
              </div>
              <button 
                onClick={() => setNutritionGuideOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-5 text-xs">
              
              {/* Protein Requirements */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-2">
                <h4 className="font-bold text-emerald-400 text-sm">1. Daily Protein Target (130g - 150g)</h4>
                <p className="text-slate-300 leading-relaxed">
                  As a 72kg athlete doing both endurance running and resistance/climbing, shoot for <strong>1.8g to 2.0g per kg of bodyweight</strong>. Supplement with 1–2 scoops of Whey Protein daily, especially post-workout paired with fine oats.
                </p>
                <div className="text-slate-400 italic">Top sources: Whey protein, chicken breast, salmon, eggs, Greek yogurt, tofu.</div>
              </div>

              {/* Creatine & Fine Oats Protocol */}
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-900/30 space-y-2">
                <h4 className="font-bold text-blue-400 text-sm">2. Creatine & Fine Oats Protocol</h4>
                <p className="text-slate-300 leading-relaxed">
                  • <strong>Creatine:</strong> Take <strong>5g daily</strong> consistently. On training days, mix it directly into your post-workout Whey + Oats shake. On rest days, take it with breakfast.<br/>
                  • <strong>Fine Oats:</strong> Use 30–50g 60–90 minutes before runs or climbing for easy-to-digest glycogen energy, and post-run to speed up recovery.
                </p>
              </div>

              {/* Carbohydrates & Glycogen */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/30 space-y-2">
                <h4 className="font-bold text-amber-400 text-sm">3. Carbohydrates & Tendon Health</h4>
                <p className="text-slate-300 leading-relaxed">
                  • <strong>Carb Loading:</strong> On long treadmill run days, prioritize complex carbs (oats, rice, pasta) to keep glycogen stores full.<br/>
                  • <strong>Tendon Health Hack:</strong> Take <strong>10g to 15g of collagen hydrolysate</strong> with Vitamin C (or orange juice) approximately 30–60 minutes <em>before</em> your bouldering sessions. Studies show this delivers amino acids directly to finger pulleys and tendons as blood pumps into your forearms while climbing.
                </p>
              </div>

              {/* Hydration */}
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-900/30 space-y-2">
                <h4 className="font-bold text-purple-400 text-sm">4. Electrolytes & Hydration</h4>
                <p className="text-slate-300 leading-relaxed">
                  Aim for <strong>3 Liters of water daily</strong>. On treadmill days, add an electrolyte powder containing sodium, magnesium, and potassium to prevent calf cramps during long runs.
                </p>
              </div>

            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => setNutritionGuideOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950"
              >
                Close Guide
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}