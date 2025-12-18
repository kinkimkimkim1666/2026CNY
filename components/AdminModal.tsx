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

        // Transform data
        const newWinners: Winner[] = [];
        data.forEach((row, index) => {
          // Flexible key checking
          const dayRaw = row.Day || row.day || row['日期'];
          const nameRaw = row.Name || row.name || row.FacebookName || row['facebook名'] || row['姓名'];
          const phoneRaw = row.Phone || row.phone || row.PhoneNumber || row['電話號碼'] || row['電話'];

          if (dayRaw && nameRaw) {
             // Extract number from day if string (e.g., "Day 1" -> 1)
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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white text-gray-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-red-700 p-4 flex justify-between items-center text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            更新得獎名單
          </h3>
          <button onClick={onClose} className="hover:bg-red-600 p-1 rounded transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-bold text-yellow-800 mb-2 text-sm">Excel 格式說明</h4>
            <p className="text-sm text-gray-600 mb-2">
              請上傳 .xlsx 或 .csv 檔案。系統會自動偵測以下欄位名稱：
            </p>
            <ul className="text-xs text-gray-500 list-disc list-inside space-y-1">
              <li><b>Day / 日期</b> (例如: 1, 2, 3...)</li>
              <li><b>Name / FacebookName / facebook名</b></li>
              <li><b>Phone / PhoneNumber / 電話號碼</b></li>
            </ul>
             <button 
                onClick={handleDownloadTemplate}
                className="mt-3 flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
                <Download className="w-3 h-3" /> 下載範本
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer relative">
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-10 h-10 text-gray-400 mb-3" />
            <p className="font-medium text-gray-600">點擊上傳 Excel 檔案</p>
            <p className="text-xs text-gray-400 mt-1">支援 .xlsx, .xls</p>
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;