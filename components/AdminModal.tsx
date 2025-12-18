import React, { useState } from 'react';
import { X, Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Winner, ExcelRow } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (winners: Winner[]) => void;
}

const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose, onUpdate }) => {
  const [status, setStatus] = useState<{ type: 'success' | 'error' | '', msg: string }>({ type: '', msg: '' });

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setStatus({ type: '', msg: '' });
    
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // Parse raw data
        const data = XLSX.utils.sheet_to_json<ExcelRow>(ws);
        const newWinners: Winner[] = [];

        data.forEach((row, index) => {
          // Flexible column matching
          const dayVal = row.Day || row.day || row['日期'];
          const nameVal = row.Name || row.name || row.FacebookName || row['facebook名'] || row['姓名'];
          const phoneVal = row.Phone || row.phone || row.PhoneNumber || row['電話號碼'] || row['電話'];

          if (dayVal && nameVal) {
             // Extract number from day if string (e.g., "Day 1" -> 1)
             const dayNum = typeof dayVal === 'number' 
               ? dayVal 
               : parseInt(String(dayVal).replace(/\D/g, '')) || 1;

             newWinners.push({
               id: `w-${Date.now()}-${index}`,
               day: dayNum,
               name: String(nameVal).trim(),
               phone: String(phoneVal || '').trim()
             });
          }
        });

        if (newWinners.length > 0) {
          onUpdate(newWinners);
          setStatus({ type: 'success', msg: `成功導入 ${newWinners.length} 筆資料` });
        } else {
          setStatus({ type: 'error', msg: '未找到有效資料。請檢查 Excel 欄位名稱。' });
        }
      } catch (err) {
        console.error(err);
        setStatus({ type: 'error', msg: '讀取檔案失敗，請確認檔案格式正確。' });
      }
    };
    reader.readAsBinaryString(file);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
        { '日期': 1, 'facebook名': 'Chan Tai Man', '電話號碼': '91234567' },
        { '日期': 2, 'facebook名': 'Amy Wong', '電話號碼': '61234567' },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Winners");
    XLSX.writeFile(wb, "lucky_draw_template.xlsx");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden border border-stone-100">
        <div className="bg-stone-50 p-4 border-b border-stone-100 flex justify-between items-center">
          <h3 className="font-serif font-bold text-stone-800 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-red-700" />
            更新名單
          </h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="text-sm text-stone-600 bg-blue-50/50 p-4 rounded border border-blue-100">
            <p className="font-bold mb-2 text-blue-900">Excel 欄位要求：</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>日期 (Day)</li>
              <li>facebook名 (Name)</li>
              <li>電話號碼 (Phone)</li>
            </ul>
            <button onClick={downloadTemplate} className="mt-3 text-xs flex items-center gap-1 text-blue-700 hover:underline">
              <Download className="w-3 h-3" /> 下載範本
            </button>
          </div>

          {/* Upload Area */}
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-stone-300 border-dashed rounded-lg cursor-pointer bg-stone-50 hover:bg-stone-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-stone-400" />
              <p className="mb-2 text-sm text-stone-500">點擊上傳 Excel 檔案</p>
            </div>
            <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
          </label>

          {/* Status Messages */}
          {status.msg && (
            <div className={`p-3 rounded flex items-center gap-2 text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {status.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminModal;