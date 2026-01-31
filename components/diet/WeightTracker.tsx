import React, { useState, useEffect } from 'react';
import { Card } from '@/components/diet/ui/Card';
import { Button } from '@/components/diet/ui/Button';
import { Trash2, TrendingUp, Scale } from 'lucide-react';
import { getLocalDateString } from '@/lib/utils/dateUtils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';
import { API_BASE_URL } from '@/lib/config';

interface WeightLog {
    id: string;
    date: string;
    weight: number;
    muscle_mass?: number;
    fat_mass?: number;
    water_percent?: number;
    visceral_fat?: number;
    bone_mass?: number;
}

export const WeightTracker: React.FC = () => {
    const [logs, setLogs] = useState<WeightLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        date: getLocalDateString(),
        weight: '',
        muscle_mass: '',
        fat_mass: '',
        water_percent: '',
        visceral_fat: '',
        bone_mass: ''
    });

    const fetchLogs = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/weights`);
            if (res.ok) {
                const data = await res.json() as any;
                // Sort for charts: oldest to newest
                // The API returns newest first (good for list), so we reverse for charts
                setLogs(data);
            }
        } catch (error) {
            console.error("Failed to fetch weights", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/weights`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    weight: Number(formData.weight),
                    muscle_mass: formData.muscle_mass ? Number(formData.muscle_mass) : null,
                    fat_mass: formData.fat_mass ? Number(formData.fat_mass) : null,
                    water_percent: formData.water_percent ? Number(formData.water_percent) : null,
                    visceral_fat: formData.visceral_fat ? Number(formData.visceral_fat) : null,
                    bone_mass: formData.bone_mass ? Number(formData.bone_mass) : null
                })
            });

            if (res.ok) {
                fetchLogs();
                // Reset form but keep date
                setFormData(prev => ({ ...prev, weight: '', muscle_mass: '', fat_mass: '', water_percent: '', visceral_fat: '', bone_mass: '' }));
            }
        } catch (error) {
            console.error("Error saving weight", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await fetch(`${API_BASE_URL}/api/weights/${id}`, { method: 'DELETE' });
            setLogs(prev => prev.filter(l => l.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const chartData = [...logs].reverse();

    return (
        <div className="space-y-8 animate-fade-in">

            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="bg-lime-500/10 p-3 rounded-2xl">
                    <Scale className="w-8 h-8 text-lime-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white font-display">Acompanhamento</h2>
                    <p className="text-zinc-400 text-sm">Peso & Bioimpedância</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="p-4 border-lime-500/20 bg-lime-500/5">
                    <p className="text-xs text-lime-500 font-bold uppercase mb-1">Peso Atual</p>
                    <p className="text-2xl font-black text-white">{logs[0]?.weight || '--'} <span className="text-sm text-zinc-500">kg</span></p>
                </Card>
                <Card className="p-4 border-purple-500/20 bg-purple-500/5">
                    <p className="text-xs text-purple-500 font-bold uppercase mb-1">Músculo</p>
                    <p className="text-2xl font-black text-white">{logs[0]?.muscle_mass || '--'} <span className="text-sm text-zinc-500">kg</span></p>
                </Card>
                <Card className="p-4 border-yellow-500/20 bg-yellow-500/5">
                    <p className="text-xs text-yellow-500 font-bold uppercase mb-1">Gordura</p>
                    <p className="text-2xl font-black text-white">{logs[0]?.fat_mass || '--'} <span className="text-sm text-zinc-500">%</span></p>
                </Card>
                <Card className="p-4 border-blue-500/20 bg-blue-500/5">
                    <p className="text-xs text-blue-500 font-bold uppercase mb-1">Água</p>
                    <p className="text-2xl font-black text-white">{logs[0]?.water_percent || '--'} <span className="text-sm text-zinc-500">%</span></p>
                </Card>
            </div>

            {/* Chart */}
            <Card className="p-1 pb-4">
                <div className="p-4 border-b border-zinc-800 mb-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-lime-400" /> Evolução
                    </h3>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(str) => {
                                    const date = new Date(str);
                                    return `${date.getDate()}/${date.getMonth() + 1}`;
                                }}
                                stroke="#71717a"
                                fontSize={10}
                                tickMargin={10}
                            />
                            <YAxis
                                domain={['dataMin - 2', 'dataMax + 2']}
                                stroke="#71717a"
                                fontSize={10}
                                tickFormatter={(val) => `${val}kg`}
                                width={35}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5' }}
                                labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="weight"
                                stroke="#84cc16"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorWeight)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* Add New Log Form */}
            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="font-bold text-lg text-white mb-4">Novo Registro</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Data</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-lime-500 transition-colors"
                                style={{ colorScheme: 'dark' }}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Peso (kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                required
                                value={formData.weight}
                                onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-lime-500 transition-colors"
                                placeholder="0.0"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Músculo (kg)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.muscle_mass}
                                onChange={e => setFormData({ ...formData, muscle_mass: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Gordura (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.fat_mass}
                                onChange={e => setFormData({ ...formData, fat_mass: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Água (%)</label>
                            <input type="number" step="0.1" value={formData.water_percent} onChange={e => setFormData({ ...formData, water_percent: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-sm text-white focus:border-blue-500" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Visceral</label>
                            <input type="number" step="0.1" value={formData.visceral_fat} onChange={e => setFormData({ ...formData, visceral_fat: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-sm text-white focus:border-red-500" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Osso (kg)</label>
                            <input type="number" step="0.1" value={formData.bone_mass} onChange={e => setFormData({ ...formData, bone_mass: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-sm text-white focus:border-zinc-500" />
                        </div>
                    </div>

                    <Button type="submit" isLoading={submitting} className="w-full mt-4">
                        Salvar Registro
                    </Button>
                </form>
            </Card>

            {/* History List */}
            <h3 className="font-bold text-lg text-white px-2">Histórico Recente</h3>
            <div className="space-y-3">
                {logs.map(log => (
                    <div key={log.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                            <div className="text-center bg-zinc-950 p-2 rounded-xl border border-zinc-800 w-14">
                                <p className="text-xs font-bold text-zinc-500 uppercase">{new Date(log.date).toLocaleDateString('pt-BR', { month: 'short' })}</p>
                                <p className="text-xl font-black text-white">{new Date(log.date).getDate()}</p>
                            </div>
                            <div>
                                <p className="text-xl font-black text-white">{log.weight} <span className="text-sm text-zinc-500 font-bold">kg</span></p>
                                <p className="text-xs text-zinc-500 font-medium">
                                    {log.muscle_mass ? `Músculo: ${log.muscle_mass}kg` : ''}
                                    {log.muscle_mass && log.fat_mass ? ' • ' : ''}
                                    {log.fat_mass ? `Gordura: ${log.fat_mass}%` : ''}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(log.id)}
                            className="text-zinc-600 hover:text-red-500 p-3 rounded-xl hover:bg-red-500/10 transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
