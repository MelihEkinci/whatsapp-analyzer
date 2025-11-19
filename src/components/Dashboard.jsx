import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { MessageSquare, Users, Clock, Calendar } from 'lucide-react';

const COLORS = ['#4ade80', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa'];

const StatCard = ({ icon: Icon, title, value, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700"
    >
        <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <p className="text-slate-400 text-sm">{title}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
        </div>
    </motion.div>
);

const Dashboard = ({ data }) => {
    if (!data) return null;

    // User Detail Modal State
    const [selectedUser, setSelectedUser] = React.useState(null);

    const UserDetailModal = ({ user, onClose }) => {
        if (!user) return null;
        const userStats = data.users[user];
        const userPersonality = data.personalities[user] || [];

        // Sentiment Color
        const sentimentScore = userStats.sentimentCount > 0 ? (userStats.sentimentScore / userStats.sentimentCount) : 0;
        const sentimentColor = sentimentScore > 0.2 ? 'text-green-400' : (sentimentScore < -0.1 ? 'text-red-400' : 'text-yellow-400');
        const sentimentText = sentimentScore > 0.2 ? 'Positive 😃' : (sentimentScore < -0.1 ? 'Negative 😠' : 'Neutral 😐');

        return (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">{user}</h2>
                            <div className="flex flex-wrap gap-2">
                                {userPersonality.map((trait, i) => (
                                    <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                                        {trait}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <h3 className="text-slate-400 text-sm mb-4 font-semibold uppercase tracking-wider">Activity Stats</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-300">Total Messages</span>
                                    <span className="font-mono text-white">{userStats.count.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-300">Words per Message</span>
                                    <span className="font-mono text-white">{(userStats.words / userStats.count).toFixed(1)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-300">Daily Avg</span>
                                    <span className="font-mono text-white">{(userStats.count / Object.keys(data.timeline).length).toFixed(1)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <h3 className="text-slate-400 text-sm mb-4 font-semibold uppercase tracking-wider">Vibe Check</h3>
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className={`text-4xl font-bold mb-2 ${sentimentColor}`}>{sentimentText}</div>
                                <div className="text-slate-500 text-xs">Based on emoji & word usage</div>
                                <div className="mt-4 w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${sentimentScore > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                        style={{ width: `${Math.min(100, Math.abs(sentimentScore) * 100)}%`, marginLeft: sentimentScore < 0 ? '0' : 'auto', marginRight: sentimentScore > 0 ? '0' : 'auto' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 md:col-span-2">
                            <h3 className="text-slate-400 text-sm mb-4 font-semibold uppercase tracking-wider">Habits</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-2xl mb-1">🦉</div>
                                    <div className="text-xs text-slate-400">Night Owl</div>
                                    <div className="font-mono text-white">{((userStats.nightOwlCount / userStats.count) * 100).toFixed(0)}%</div>
                                </div>
                                <div>
                                    <div className="text-2xl mb-1">☀️</div>
                                    <div className="text-xs text-slate-400">Early Bird</div>
                                    <div className="font-mono text-white">{((userStats.earlyBirdCount / userStats.count) * 100).toFixed(0)}%</div>
                                </div>
                                <div>
                                    <div className="text-2xl mb-1">📅</div>
                                    <div className="text-xs text-slate-400">Weekend</div>
                                    <div className="font-mono text-white">{((userStats.weekendCount / userStats.count) * 100).toFixed(0)}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-8 pb-20">
            {selectedUser && <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />}

            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Messages"
                    value={data.totalMessages.toLocaleString()}
                    icon={MessageSquare}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Active Participants"
                    value={Object.keys(data.users).length}
                    icon={Users}
                    color="bg-green-500"
                />
                <StatCard
                    title="Duration"
                    value={`${Object.keys(data.timeline).length} Days`}
                    icon={Calendar}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Peak Time"
                    value={`${data.hourlyActivity.indexOf(Math.max(...data.hourlyActivity))}:00`}
                    icon={Clock}
                    color="bg-orange-500"
                />
            </div>

            {/* User Personalities & Details */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-xl"
            >
                <h3 className="text-xl font-semibold mb-6 text-slate-200 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    User Profiles (Click for Details)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(data.personalities).map(([user, traits], index) => (
                        <motion.div
                            key={user}
                            whileHover={{ scale: 1.02, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
                            className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 cursor-pointer group"
                            onClick={() => setSelectedUser(user)}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-lg text-slate-200 group-hover:text-blue-400 transition-colors">{user}</h4>
                                <span className="text-xs font-mono text-slate-500">#{index + 1}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {traits.map((trait, i) => (
                                    <span key={i} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">
                                        {trait}
                                    </span>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-slate-400 mt-2 pt-2 border-t border-slate-800">
                                <span>{data.users[user].count.toLocaleString()} msgs</span>
                                <span>{(data.users[user].sentimentCount > 0 ? (data.users[user].sentimentScore / data.users[user].sentimentCount).toFixed(2) : '0.00')} vibe</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Timeline */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-xl"
                >
                    <h3 className="text-lg font-semibold mb-6 text-slate-200">Activity Over Time</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={Object.entries(data.timeline).map(([date, count]) => ({ date, count }))}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} minTickGap={30} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f1f5f9' }}
                                    itemStyle={{ color: '#60a5fa' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#60a5fa" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Hourly Activity */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-xl"
                >
                    <h3 className="text-lg font-semibold mb-6 text-slate-200">Hourly Habits</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.hourlyActivity.map((count, hour) => ({ hour: `${hour}:00`, count }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} interval={3} />
                                <Tooltip
                                    cursor={{ fill: '#334155', opacity: 0.2 }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f1f5f9' }}
                                />
                                <Bar dataKey="count" fill="#f472b6" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Rankings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Conversation Starters Ranking */}
                <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 flex flex-col h-[320px]">
                    <h4 className="text-slate-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-blue-400" /> Conversation Starters
                    </h4>
                    <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar flex-1">
                        {Object.entries(data.conversationStarters)
                            .sort(([, a], [, b]) => b - a)
                            .map(([user, count], i) => (
                                <div key={user} className="flex items-center justify-between p-2 hover:bg-slate-700/30 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-mono w-5 h-5 flex items-center justify-center rounded-full ${i < 3 ? 'bg-blue-500/20 text-blue-300' : 'text-slate-500'}`}>
                                            {i + 1}
                                        </span>
                                        <span className="text-sm text-slate-200 font-medium truncate max-w-[100px]">{user}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-400">{count}</span>
                                </div>
                            ))}
                    </div>
                </div >

                {/* Fastest Responders Ranking */}
                < div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 flex flex-col h-[320px]" >
                    <h4 className="text-slate-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-green-400" /> Fastest Responders
                    </h4>
                    <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar flex-1">
                        {Object.entries(data.responseTimes)
                            .filter(([, d]) => d.count > 5)
                            .map(([user, d]) => ({ user, avg: d.totalTime / d.count }))
                            .sort((a, b) => a.avg - b.avg)
                            .map((item, i) => (
                                <div key={item.user} className="flex items-center justify-between p-2 hover:bg-slate-700/30 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-mono w-5 h-5 flex items-center justify-center rounded-full ${i < 3 ? 'bg-green-500/20 text-green-300' : 'text-slate-500'}`}>
                                            {i + 1}
                                        </span>
                                        <span className="text-sm text-slate-200 font-medium truncate max-w-[100px]">{item.user}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-400">{(item.avg / 1000 / 60).toFixed(1)}m</span>
                                </div>
                            ))}
                    </div>
                </div >

                {/* Media Addicts Ranking */}
                < div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 flex flex-col h-[320px]" >
                    <h4 className="text-slate-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-400" /> Media Addicts
                    </h4>
                    <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar flex-1">
                        {Object.entries(data.mediaCount)
                            .sort(([, a], [, b]) => b - a)
                            .map(([user, count], i) => (
                                <div key={user} className="flex items-center justify-between p-2 hover:bg-slate-700/30 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-mono w-5 h-5 flex items-center justify-center rounded-full ${i < 3 ? 'bg-purple-500/20 text-purple-300' : 'text-slate-500'}`}>
                                            {i + 1}
                                        </span>
                                        <span className="text-sm text-slate-200 font-medium truncate max-w-[100px]">{user}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-400">{count}</span>
                                </div>
                            ))}
                    </div>
                </div >

                {/* Vocabulary Ranking */}
                < div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 flex flex-col h-[320px]" >
                    <h4 className="text-slate-400 text-xs uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-orange-400" /> Vocabulary
                    </h4>
                    <div className="overflow-y-auto pr-2 space-y-3 custom-scrollbar flex-1">
                        {Object.entries(data.vocabulary)
                            .sort(([, a], [, b]) => b.uniqueWords.size - a.uniqueWords.size)
                            .map(([user, stats], i) => (
                                <div key={user} className="flex items-center justify-between p-2 hover:bg-slate-700/30 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-mono w-5 h-5 flex items-center justify-center rounded-full ${i < 3 ? 'bg-orange-500/20 text-orange-300' : 'text-slate-500'}`}>
                                            {i + 1}
                                        </span>
                                        <span className="text-sm text-slate-200 font-medium truncate max-w-[100px]">{user}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-400">{stats.uniqueWords.size}</span>
                                </div>
                            ))}
                    </div>
                </div >
            </div >

            {/* Interaction Matrix (Restored) */}
            < motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-xl"
            >
                <h3 className="text-lg font-semibold mb-6 text-slate-200 flex items-center gap-2">
                    <Users className="w-5 h-5 text-pink-400" /> Top Interactions (Who replies to whom?)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(data.interactionMatrix)
                        .flatMap(([author, replies]) =>
                            Object.entries(replies).map(([repliedTo, count]) => ({ author, repliedTo, count }))
                        )
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 9)
                        .map((pair, i) => (
                            <div key={i} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                                <div className="flex items-center gap-2 text-sm truncate">
                                    <span className="font-medium text-green-400 truncate max-w-[80px]">{pair.author}</span>
                                    <span className="text-slate-500">→</span>
                                    <span className="font-medium text-blue-400 truncate max-w-[80px]">{pair.repliedTo}</span>
                                </div>
                                <span className="text-slate-200 font-bold bg-slate-800 px-2 py-1 rounded-md text-xs">{pair.count}</span>
                            </div>
                        ))}
                </div>
            </motion.div >

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Topics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-xl"
                >
                    <h3 className="text-lg font-semibold mb-6 text-slate-200">Top Topics (Phrases)</h3>
                    <div className="flex flex-wrap gap-3 justify-center h-[300px] overflow-y-auto content-start">
                        {data.topBigrams.length > 0 ? (
                            data.topBigrams.map((item, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-sm border border-slate-600 hover:bg-slate-600 transition-colors cursor-default"
                                    style={{
                                        fontSize: `${Math.max(0.8, Math.min(1.5, 0.8 + (item.value / (data.topBigrams[0]?.value || 1))))}rem`,
                                        opacity: Math.max(0.5, 1 - (index * 0.02))
                                    }}
                                >
                                    {item.text}
                                </span>
                            ))
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-slate-500">
                                No topics found
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Emojis */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-xl"
                >
                    <h3 className="text-lg font-semibold mb-6 text-slate-200">Top Emojis</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={data.topEmojis}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis dataKey="emoji" type="category" width={30} tick={{ fontSize: 20 }} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#334155', opacity: 0.2 }}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#f1f5f9' }}
                                />
                                <Bar dataKey="count" fill="#fbbf24" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div >
    );
};

export default Dashboard;
