import { AlertCircle } from 'lucide-react';
export default function ErrorMessage({ message }) { if (!message) return null; return <div role="alert" className="flex items-start gap-3 border-l-4 border-rose-500 bg-rose-50 px-4 py-3 text-sm text-rose-800"><AlertCircle size={18} className="mt-0.5 shrink-0" />{message}</div>; }
