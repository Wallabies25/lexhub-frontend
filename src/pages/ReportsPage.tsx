import React, { useState, useEffect } from 'react';
import { Download, FileText, TrendingUp, DollarSign, Calendar, ChevronRight, Shield } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { api } from '../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportsPage: React.FC = () => {
  const { user, role } = useUser();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchReportData();
    fetchRecentConsultations();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const data = await api.get('/reports/summary');
      setSummary(data);
    } catch (error) {
      toast.error("Failed to load report summary");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentConsultations = async () => {
    try {
      const data = await api.get('/consultations/my-consultations');
      setRecentActivities(data);
    } catch (error) {
      console.error("Failed to load activities", error);
    }
  };

  const generatePDF = (range: 'weekly' | 'monthly' | 'yearly') => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
      
      // Header
      doc.setFillColor(30, 58, 138); // Dark blue (LexHub Blue)
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('LEXHUB', 15, 25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('OFFICIAL PERFORMANCE REPORT', 15, 32);
      
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - 15, 25, { align: 'right' });
      doc.text(`Range: ${range.toUpperCase()}`, pageWidth - 15, 32, { align: 'right' });

      // User Info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Account Holder: ${user?.name || 'User'}`, 15, 55);
      doc.setFont('helvetica', 'normal');
      doc.text(`Account Type: ${role?.toUpperCase()}`, 15, 62);

      // Summary Cards (in a box)
      doc.setDrawColor(230, 230, 230);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(15, 75, pageWidth - 30, 30, 3, 3, 'FD');
      
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text('Total Consultations', 25, 85);
      doc.text(role === 'lawyer' ? 'Total Earnings' : 'Total Spending', pageWidth / 2 - 20, 85);
      doc.text('Engagement Rate', pageWidth - 60, 85);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(`${summary?.total || 0}`, 25, 95);
      doc.text(`LKR ${(summary?.total_earned || summary?.total_spent || 0).toLocaleString()}`, pageWidth / 2 - 20, 95);
      doc.text(`${summary?.total > 0 ? Math.round((summary.completed/summary.total)*100) : 0}%`, pageWidth - 60, 95);

      // Table
      const tableData = recentActivities.map(item => [
        `LH-C-${item.id}`,
        role === 'lawyer' ? 'Client Case' : 'Legal Consultation',
        item.consultation_date,
        item.consultation_time,
        item.status.toUpperCase()
      ]);

      autoTable(doc, {
        startY: 120,
        head: [['Ref ID', 'Type', 'Date', 'Time', 'Status']],
        body: tableData,
        headStyles: { fillColor: [30, 58, 138], fontSize: 10 },
        styles: { fontSize: 9 },
        margin: { top: 120 }
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'italic');
        doc.text(
          'LexHub - Empowering Professional Legal Excellence. This document is a system-generated summary of your activity on our secure platform.',
          pageWidth / 2,
          pageHeight - 15,
          { align: 'center' }
        );
        doc.text(`(c) 2026 LexHub. Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      }

      doc.save(`LexHub_Report_${range}_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success(`${range.charAt(0).toUpperCase() + range.slice(1)} PDF downloaded!`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  const chartData = summary?.chart_data || [];
  const maxChartValue = Math.max(...chartData.map((d: any) => d.value), 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-12 px-4 pb-20">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Performance & Reports</h1>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Analyze your legal {role === 'lawyer' ? 'business' : 'engagements'} and download summaries.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => generatePDF('weekly')}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
            >
              <Download className="w-4 h-4" /> Weekly PDF
            </button>
            <button 
              onClick={() => generatePDF('monthly')}
              className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20"
            >
              <Download className="w-4 h-4" /> Monthly PDF
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Total Consultations" 
            value={summary?.total || 0} 
            icon={<FileText className="w-6 h-6 text-blue-600" />} 
            trend="+12% from last month"
          />
          <StatCard 
            title="Confirmed Cases" 
            value={summary?.confirmed || 0} 
            icon={<Shield className="w-6 h-6 text-emerald-600" />} 
            trend="Active Status"
          />
          <StatCard 
            title={role === 'lawyer' ? "Total Earned" : "Total Spent"} 
            value={`LKR ${(summary?.total_earned || summary?.total_spent || 0).toLocaleString()}`} 
            icon={<DollarSign className="w-6 h-6 text-amber-600" />} 
            trend="Financial Summary"
          />
          <StatCard 
            title="Engagement Rate" 
            value={summary?.total > 0 ? `${Math.round((summary.completed/summary.total)*100)}%` : "0%"} 
            icon={<TrendingUp className="w-6 h-6 text-purple-600" />} 
            trend="Completion target"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 p-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Activity Trends
              </h2>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last 6 Months</span>
            </div>
            
            <div className="flex items-end justify-between h-64 gap-2 px-4">
              {chartData.map((data: any, idx: number) => (
                <div key={idx} className="flex-1 flex flex-col items-center group">
                  <div className="w-full max-w-[40px] relative">
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
                      {data.value} Consults
                    </div>
                    {/* Bar */}
                    <div 
                      style={{ height: `${(data.value / maxChartValue) * 100}%` }}
                      className="bg-gradient-to-t from-blue-700 to-blue-400 rounded-lg group-hover:from-blue-600 group-hover:to-blue-300 transition-all duration-500 shadow-lg shadow-blue-500/20"
                    ></div>
                  </div>
                  <span className="mt-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{data.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions / Download Yearly */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-900 rounded-3xl p-8 text-white flex flex-col justify-between shadow-2xl shadow-blue-900/40">
            <div>
              <Calendar className="w-12 h-12 mb-6 text-blue-300 opacity-50" />
              <h2 className="text-2xl font-black mb-2">Annual Summary</h2>
              <p className="text-blue-100 text-sm mb-8 leading-relaxed">
                Get a comprehensive breakdown of all your activity for the entire year 2026. Perfect for tax and legal auditing.
              </p>
            </div>
            <button 
              onClick={() => generatePDF('yearly')}
              className="bg-white text-blue-900 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-50 transition active:scale-95"
            >
              <Download className="w-5 h-5" /> Download Full PDF
            </button>
          </div>
        </div>

        {/* Detailed Table Section */}
        <div className="mt-10 bg-white dark:bg-gray-800 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Log Entries</h2>
            <button className="text-blue-600 font-bold text-sm hover:underline">View All Records</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-gray-700">
                  <th className="px-8 py-4">Transaction ID</th>
                  <th className="px-8 py-4">{role === 'lawyer' ? 'Client' : 'Lawyer'}</th>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                {recentActivities.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-8 py-5 font-mono text-xs font-bold text-blue-900 dark:text-blue-400 uppercase">LH-C-{item.id}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center text-xs font-black">
                         {role === 'lawyer' ? 'C' : 'L'}
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">{role === 'lawyer' ? 'Client Request' : 'Legal Consultation'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-gray-600 dark:text-gray-400">{item.consultation_date}</td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tight
                        ${item.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 
                          item.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                          'bg-yellow-100 text-yellow-800'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, trend }: { title: string, value: any, icon: React.ReactNode, trend: string }) => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg shadow-gray-200/40 dark:shadow-none border border-gray-50 dark:border-gray-700 p-6 hover:translate-y-[-2px] transition duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">{icon}</div>
      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{trend}</span>
    </div>
    <p className="text-3xl font-black text-gray-900 dark:text-white mb-1">{value}</p>
    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">{title}</p>
  </div>
);

export default ReportsPage;
