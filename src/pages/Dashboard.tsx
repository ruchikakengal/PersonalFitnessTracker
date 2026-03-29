import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, Heart, Thermometer, Clock, Scale, Ruler, User, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { calculateFitnessResults, generateWeeklyData, type UserData, type FitnessResults } from '@/lib/fitness-utils';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import Footer from '@/components/Footer';

const defaultData: UserData = { age: 25, gender: 'male', heightCm: 175, weightKg: 70, heartRate: 85, bodyTemp: 37.0, duration: 30 };

export default function Dashboard() {
  const [formData, setFormData] = useState<UserData>(defaultData);
  const [results, setResults] = useState<FitnessResults | null>(null);
  const [weeklyData] = useState(generateWeeklyData);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    setTimeout(() => {
      setResults(calculateFitnessResults(formData));
      setLoading(false);
    }, 800);
  };

  const update = (field: keyof UserData, value: number | string) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };

  const inputClass = "w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">
            Fitness <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mb-8">Enter your health data to get AI-powered fitness analysis.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 lg:col-span-1">
            <h2 className="font-heading font-semibold text-lg mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Health Data
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Age</label>
                  <input type="number" value={formData.age} onChange={(e) => update('age', +e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Gender</label>
                  <select value={formData.gender} onChange={(e) => update('gender', e.target.value)} className={inputClass}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Ruler className="w-3 h-3" /> Height (cm)</label>
                  <input type="number" value={formData.heightCm} onChange={(e) => update('heightCm', +e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Scale className="w-3 h-3" /> Weight (kg)</label>
                  <input type="number" value={formData.weightKg} onChange={(e) => update('weightKg', +e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Heart className="w-3 h-3" /> Heart Rate (bpm)</label>
                <input type="number" value={formData.heartRate} onChange={(e) => update('heartRate', +e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Thermometer className="w-3 h-3" /> Body Temp (°C)</label>
                <input type="number" step="0.1" value={formData.bodyTemp} onChange={(e) => update('bodyTemp', +e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Workout Duration (min)</label>
                <input type="number" value={formData.duration} onChange={(e) => update('duration', +e.target.value)} className={inputClass} />
              </div>
              <Button onClick={handleAnalyze} disabled={loading} className="w-full rounded-lg font-semibold mt-2" style={{ background: 'var(--gradient-primary)' }}>
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Analyzing...</span>
                ) : (
                  <span className="flex items-center gap-2"><Zap className="w-4 h-4" /> Analyze</span>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stat Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'BMI', value: results?.bmi ?? '--', sub: results?.bmiCategory ?? '', icon: Scale, color: 'text-chart-blue' },
                { label: 'Calories Burned', value: results?.caloriesBurned ?? '--', sub: 'kcal', icon: Flame, color: 'text-chart-orange' },
                { label: 'Heart Rate Zone', value: results ? formData.heartRate : '--', sub: results?.heartRateZone ?? 'bpm', icon: Heart, color: 'text-chart-pink' },
                { label: 'Intensity', value: results?.activityIntensity ?? '--', sub: 'level', icon: Activity, color: 'text-chart-green' },
              ].map((s) => (
                <div key={s.label} className="glass-card rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">{s.label}</span>
                    <s.icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <div className="font-heading text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.sub}</div>
                </div>
              ))}
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6">
                <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Weekly Calories
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={weeklyData}>
                    <defs>
                      <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(262 83% 64%)" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(262 83% 64%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 15% 20%)" />
                    <XAxis dataKey="day" tick={{ fill: 'hsl(220 10% 55%)', fontSize: 12 }} axisLine={false} />
                    <YAxis tick={{ fill: 'hsl(220 10% 55%)', fontSize: 12 }} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'hsl(230 20% 12%)', border: '1px solid hsl(230 15% 20%)', borderRadius: '8px', color: '#fff' }} />
                    <Area type="monotone" dataKey="calories" stroke="hsl(262 83% 64%)" fill="url(#calGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="glass-card rounded-2xl p-6">
                <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" /> Weekly Activity
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 15% 20%)" />
                    <XAxis dataKey="day" tick={{ fill: 'hsl(220 10% 55%)', fontSize: 12 }} axisLine={false} />
                    <YAxis tick={{ fill: 'hsl(220 10% 55%)', fontSize: 12 }} axisLine={false} />
                    <Tooltip contentStyle={{ background: 'hsl(230 20% 12%)', border: '1px solid hsl(230 15% 20%)', borderRadius: '8px', color: '#fff' }} />
                    <Bar dataKey="duration" fill="hsl(330 80% 62%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Heart Rate Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="glass-card rounded-2xl p-6">
              <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-chart-pink" /> Weekly Heart Rate
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(330 80% 62%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(330 80% 62%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(230 15% 20%)" />
                  <XAxis dataKey="day" tick={{ fill: 'hsl(220 10% 55%)', fontSize: 12 }} axisLine={false} />
                  <YAxis tick={{ fill: 'hsl(220 10% 55%)', fontSize: 12 }} axisLine={false} />
                  <Tooltip contentStyle={{ background: 'hsl(230 20% 12%)', border: '1px solid hsl(230 15% 20%)', borderRadius: '8px', color: '#fff' }} />
                  <Area type="monotone" dataKey="heartRate" stroke="hsl(330 80% 62%)" fill="url(#hrGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
