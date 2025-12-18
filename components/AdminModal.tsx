import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Winner, ExcelRow } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (winners: Winner[]) => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onUpdate }) => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');
    setSuccess('');
    
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<ExcelRow>(ws);

        const newWinners: Winner[] = [];
        data.forEach((row, index) => {
          const dayRaw = row.Day || row.day || row['日期'];
          const nameRaw = row.Name || row.name || row.FacebookName || row['facebook名'] || row['姓名'];
          const phoneRaw = row.Phone || row.phone || row.PhoneNumber || row['電話號碼'] || row['電話'];

          if (dayRaw && nameRaw) {
             const dayNum = typeof dayRaw === 'number' 
               ? dayRaw 
               : parseInt(dayRaw.toString().replace(/\D/g, '')) || 1;

             newWinners.push({
               id: `imported-${index}-${Date.now()}`,
               day: dayNum,
               name: String(nameRaw),
               phone: String(phoneRaw || '')
             });
          }
        });

        if (newWinners.length === 0) {
          setError('未能識別檔案中的資料。請確保 Excel 有 "Day", "Name", "Phone" 等欄位。');
        } else {
          onUpdate(newWinners);
          setSuccess(`成功匯入 ${newWinners.length} 位得獎者！`);
        }
      } catch (err) {
        console.error(err);
        setError('檔案讀取失敗，請檢查格式。');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
        { Day: 1, Name: "陳大文 (Example)", Phone: "91234567" },
        { Day: 2, Name: "Amy Li (Example)", Phone: "61234567" },
        { Day: 3, Name: "Peter Pan", Phone: "51234567" }
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Winners");
    XLSX.writeFile(wb, "winner_template.xlsx");
  };

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white text-stone-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-stone-100">
        <div className="border-b border-stone-100 p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center gap-2 text-stone-800">
            <FileSpreadsheet className="w-5 h-5 text-red-600" />
            更新得獎名單
          </h3>
          <button onClick={onClose} className="hover:bg-stone-100 p-2 rounded-full transition text-stone-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-800 mb-2 text-sm">Excel 格式說明</h4>
            <p className="text-sm text-stone-600 mb-2">
              請上傳 .xlsx 檔案，系統自動識別欄位：
            </p>
            <ul className="text-xs text-stone-500 list-disc list-inside space-y-1">
              <li><b>Day / 日期</b> (例如: 1)</li>
              <li><b>Name / facebook名</b></li>
              <li><b>Phone / 電話號碼</b></li>
            </ul>
             <button 
                onClick={handleDownloadTemplate}
                className="mt-3 flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 font-medium bg-white px-3 py-1.5 rounded border border-blue-200 shadow-sm"
            >
                <Download className="w-3 h-3" /> 下載範本
            </button>
          </div>

          <div className="border-2 border-dashed border-stone-200 rounded-xl p-8 flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition cursor-pointer relative group">
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
               <Upload className="w-6 h-6 text-red-500" />
            </div>
            <p className="font-medium text-stone-600">點擊上傳 Excel</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;