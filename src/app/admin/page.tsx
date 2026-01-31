'use client';

import { motion } from 'framer-motion';
import { AlertCircle, Calendar, Download, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button, Card, Select } from '@/components/ui';

// Demo data for charts
const utilizationData = [
  { name: 'Mon', rate: 65 },
  { name: 'Tue', rate: 78 },
  { name: 'Wed', rate: 82 },
  { name: 'Thu', rate: 75 },
  { name: 'Fri', rate: 60 },
];

const statusData = [
  { name: 'Completed', value: 45, color: 'var(--success)' },
  { name: 'No Show', value: 15, color: 'var(--danger)' },
  { name: 'Cancelled', value: 10, color: 'var(--foreground-secondary)' },
  { name: 'Upcoming', value: 30, color: 'var(--primary)' },
];

const peakHoursData = [
  { hour: '08:00', bookings: 2 },
  { hour: '09:00', bookings: 5 },
  { hour: '10:00', bookings: 12 },
  { hour: '11:00', bookings: 15 },
  { hour: '12:00', bookings: 8 },
  { hour: '13:00', bookings: 10 },
  { hour: '14:00', bookings: 14 },
  { hour: '15:00', bookings: 11 },
  { hour: '16:00', bookings: 7 },
  { hour: '17:00', bookings: 4 },
];

const stats = [
  {
    label: 'Avg. Utilization',
    value: '72%',
    change: '+5.4%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    label: 'Active Users',
    value: '124',
    change: '+12',
    trend: 'up',
    icon: Users,
  },
  {
    label: 'No-Show Rate',
    value: '18%',
    change: '-2.1%',
    trend: 'down',
    icon: AlertCircle,
  },
  {
    label: 'Total Bookings',
    value: '842',
    change: '+156',
    trend: 'up',
    icon: Calendar,
  },
];

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-foreground-secondary mt-1">
            Overview of office occupancy and booking behavior
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            options={[
              { value: '24h', label: 'Last 24 Hours' },
              { value: '7d', label: 'Last 7 Days' },
              { value: '30d', label: 'Last 30 Days' },
              { value: '90d', label: 'Last Quarter' },
            ]}
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-40"
          />
          <Button variant="ghost" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card padding="md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-foreground-secondary mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span
                        className={`text-xs font-medium ${
                          stat.trend === 'up' ? 'text-success' : 'text-danger'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-foreground-secondary">vs prev. period</span>
                    </div>
                  </div>
                  <div className="p-2 bg-primary-light rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Utilization Chart */}
        <Card className="lg:col-span-2">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-bold">Room Utilization Rate</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span>Average Usage</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full p-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={utilizationData}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="var(--foreground-secondary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="var(--foreground-secondary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    border: '1px border var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRate)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Status Distribution */}
        <Card>
          <div className="p-6 border-b border-border">
            <h3 className="font-bold">Booking Status</h3>
          </div>
          <div className="h-[300px] w-full p-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    border: '1px border var(--border)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-foreground-secondary">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Peak Hours Box */}
      <Card>
        <div className="p-6 border-b border-border">
          <h3 className="font-bold">Peak Booking Hours</h3>
        </div>
        <div className="h-[300px] w-full p-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={peakHoursData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="hour"
                stroke="var(--foreground-secondary)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--foreground-secondary)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  border: '1px border var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="bookings" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
