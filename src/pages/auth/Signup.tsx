import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('كلمتا المرور غير متطابقتان');
      return;
    }
    if (!agreed) {
      setError('يرجى الموافقة على الشروط والأحكام');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) {
      setError(error.message || 'حدث خطأ، حاول مجدداً');
    } else {
      navigate('/home', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#060d1a] flex flex-col px-6 py-10">
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Heart className="w-8 h-8 text-white fill-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">إنشاء حساب جديد</h1>
        <p className="text-gray-400 text-sm">انضم إلى DzHealth</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="relative">
          <User className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="الاسم الكامل"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-4 pr-12 pl-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        <div className="relative">
          <Mail className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-500" />
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-4 pr-12 pl-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>

        <div className="relative">
          <Lock className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-500" />
          <input
            type={showPw ? 'text' : 'password'}
            placeholder="كلمة المرور"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-4 pr-12 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          <button type="button" onClick={() => setShowPw(v => !v)} className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-500">
            {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="relative">
          <Lock className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-gray-500" />
          <input
            type="password"
            placeholder="تأكيد كلمة المرور"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            className="w-full bg-[#0d1b2a] border border-white/10 rounded-xl py-4 pr-12 pl-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          {confirm && (
            <div className="absolute top-1/2 -translate-y-1/2 left-4">
              {password === confirm
                ? <CheckCircle className="w-5 h-5 text-green-400" />
                : <AlertCircle className="w-5 h-5 text-red-400" />
              }
            </div>
          )}
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={e => setAgreed(e.target.checked)}
            className="w-4 h-4 rounded border-gray-700 bg-[#0d1b2a] text-cyan-500"
          />
          <span className="text-gray-400 text-sm">
            أوافق على{' '}
            <span className="text-cyan-400">الشروط والأحكام</span>
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white font-semibold text-lg shadow-lg shadow-cyan-500/20 transition-opacity disabled:opacity-60 mt-2"
        >
          {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
        </button>

        <div className="text-center">
          <span className="text-gray-400 text-sm">لديك حساب؟ </span>
          <Link to="/login" className="text-cyan-400 font-semibold text-sm">تسجيل الدخول</Link>
        </div>
      </form>
    </div>
  );
}
