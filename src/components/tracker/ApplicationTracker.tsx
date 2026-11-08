import React, { useState } from 'react';
import { ApplicationRecord } from '../../types';
import {
  Briefcase,
  Search,
  ExternalLink,
  Trash2,
  Calendar,
  CheckCircle2,
  Building2,
  ArrowRight,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';

interface ApplicationTrackerProps {
  applications: ApplicationRecord[];
  onUpdateStatus: (id: string, status: ApplicationRecord['status']) => void;
  onDeleteApplication: (id: string) => void;
  onLoadApplication: (record: ApplicationRecord) => void;
  onNewApplication: () => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onUpdateStatus,
  onDeleteApplication,
  onLoadApplication,
  onNewApplication,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedRecordForPreview, setSelectedRecordForPreview] = useState<ApplicationRecord | null>(null);

  const statuses = ['All', 'Saved', 'Applied', 'Interviewing', 'Offered', 'Archived'];

  const filtered = applications.filter((app) => {
    const matchesSearch =
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const avgScore =
    applications.length > 0
      ? Math.round(applications.reduce((acc, a) => acc + a.matchScore, 0) / applications.length)
      : 0;

  const interviewingCount = applications.filter((a) => a.status === 'Interviewing').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Intro Header & Summary KPI Strip */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">
              <span>Career Pipeline</span>
              <span aria-hidden="true">·</span>
              <span>Application Tracker</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Tracked Tailored Applications
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              Review, reload, and monitor response rates across all your tailored resume and cover letter submissions.
            </p>
          </div>

          <button
            type="button"
            onClick={onNewApplication}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors flex items-center gap-2 shadow-sm shrink-0"
          >
            <span>+ Tailor for New Job</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/80">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
              Total Tailored Applications
            </span>
            <span className="text-2xl font-black text-neutral-900 dark:text-white mt-1 block font-mono tabular-nums">
              {applications.length}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/80">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
              Average ATS Match Rating
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block font-mono tabular-nums">
              {avgScore}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/80">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
              Interviews Scheduled
            </span>
            <span className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 block font-mono tabular-nums">
              {interviewingCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company or role..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs overflow-hidden">
        {filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-950/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-6">Company & Target Role</th>
                  <th className="py-3 px-4">Date Created</th>
                  <th className="py-3 px-4 text-center">ATS Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-neutral-900 dark:text-white text-xs">
                        {item.role}
                      </div>
                      <div className="text-neutral-500 text-[11px] flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-neutral-400" />
                        <span>{item.companyName}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-neutral-600 dark:text-neutral-400 tabular-nums">
                      {item.date}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 tabular-nums">
                        {item.matchScore}%
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value as any)}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                      >
                        <option value="Saved">Saved</option>
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offered">Offered</option>
                        <option value="Archived">Archived</option>
                      </select>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onLoadApplication(item)}
                          className="px-3 py-1 text-xs font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors flex items-center gap-1"
                          title="Load this resume into tailoring editor"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Open</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteApplication(item.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors rounded-lg"
                          title="Delete from tracker"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-neutral-500">
            <Briefcase className="w-8 h-8 mx-auto mb-2 text-neutral-400" />
            <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              No saved applications found
            </p>
            <p className="text-[11px] text-neutral-500 mt-1">
              Tailor a resume in Step 4 and click &quot;Save to Tracker&quot; to keep tabs on your job applications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
