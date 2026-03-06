import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const WHATSAPP_BUSINESS_NUMBER = '8801777036747';

type Method = 'sms' | 'email' | 'whatsapp';

function generateOtp(length = 6): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

export default function OtpVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId') || '';
  const initialMethod = (searchParams.get('method') || 'sms') as Method;
  const destination = searchParams.get('to') || '';

  const [method, setMethod] = useState<Method>(initialMethod);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [whatsappOtp, setWhatsappOtp] = useState('');

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!orderId) return;
    if (method === 'whatsapp') return; // don't auto-request for whatsapp
    requestOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, method]);

  function formatTime(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  async function requestOtp() {
    if (!orderId) return;
    setLoading(true);
    setMessage('');
    try {
      await fetch(`/api/orders/${orderId}/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: destination, method })
      });
      setSecondsLeft(300);
      setMessage(`OTP sent via ${method.toUpperCase()}`);
    } catch (e) {
      setMessage('Failed to request OTP');
    } finally { setLoading(false); }
  }

  function sendViaWhatsApp() {
    const code = generateOtp();
    setWhatsappOtp(code);
    setSecondsLeft(300);
    const text = encodeURIComponent(
      `🔐 Order Verification\n\nOrder ID: ${orderId}\nMy OTP Code: ${code}\n\nPlease verify my order.`
    );
    window.open(`https://wa.me/${WHATSAPP_BUSINESS_NUMBER}?text=${text}`, '_blank');
    setMessage('WhatsApp opened — send the message, then enter the OTP below to confirm.');
  }

  async function verifyOtp() {
    if (!orderId) return;
    setLoading(true);
    setMessage('');

    if (method === 'whatsapp') {
      // For whatsapp, verify locally against the generated OTP
      if (otp === whatsappOtp && whatsappOtp.length > 0) {
        setMessage('OTP verified — order confirmed');
        // Also call skip-verify to finalize the order on backend
        try {
          await fetch(`/api/orders/${orderId}/skip-verify`, { method: 'POST' });
        } catch (_) {}
        setTimeout(() => navigate(`/orders/${orderId}`), 800);
      } else {
        setMessage('Invalid OTP. Make sure you enter the code shown above.');
      }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/orders/${orderId}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: destination, otp })
      });
      if (res.ok) {
        setMessage('OTP verified — order confirmed');
        setTimeout(() => navigate(`/orders/${orderId}`), 800);
      } else {
        const body = await res.json();
        setMessage(body?.message || 'Invalid or expired OTP');
      }
    } catch (e) {
      setMessage('Verification failed');
    } finally { setLoading(false); }
  }

  async function skipVerification() {
    if (!orderId) return;
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/orders/${orderId}/skip-verify`, { method: 'POST' });
      if (res.ok) {
        setMessage('Order finalized without OTP');
        setTimeout(() => navigate(`/orders/${orderId}`), 800);
      } else {
        const body = await res.json();
        setMessage(body?.message || 'Unable to skip verification');
      }
    } catch (e) {
      setMessage('Skip verification failed');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white p-6">
      <div className="max-w-xl w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-2">Verify your order</h1>
        <p className="text-sm text-slate-500 mb-4">Order: <span className="font-medium">{orderId}</span></p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-2">Delivery contact</label>
          <div className="flex items-center gap-3">
            <div className="flex-1 p-3 bg-slate-50 rounded-md border border-slate-100">{destination || 'Not provided'}</div>
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => setMethod('sms')} className={`px-3 py-1 rounded text-sm ${method==='sms'?'bg-sky-600 text-white':'bg-slate-100'}`}>SMS</button>
              <button onClick={() => setMethod('email')} className={`px-3 py-1 rounded text-sm ${method==='email'?'bg-sky-600 text-white':'bg-slate-100'}`}>Email</button>
              <button onClick={() => setMethod('whatsapp')} className={`px-3 py-1 rounded text-sm ${method==='whatsapp'?'bg-green-600 text-white':'bg-slate-100'}`}>WhatsApp</button>
            </div>
          </div>
        </div>

        {method === 'whatsapp' ? (
          <div className="mb-4 space-y-3">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 mb-2 font-medium">📱 WhatsApp Verification</p>
              <p className="text-xs text-green-700 mb-3">Click the button below to open WhatsApp with a pre-filled OTP message. Send it to our business number, then enter the OTP code here to confirm.</p>
              <button
                onClick={sendViaWhatsApp}
                className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Send OTP via WhatsApp
              </button>
            </div>

            {whatsappOtp && (
              <>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-center">
                  <p className="text-xs text-amber-700 mb-1">Your OTP code (also sent via WhatsApp):</p>
                  <p className="text-2xl font-bold tracking-widest text-amber-900">{whatsappOtp}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Enter OTP to confirm</label>
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0,6))} placeholder="6-digit code"
                    className="w-full p-3 text-lg text-center tracking-widest rounded-md border border-slate-200" />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">Enter OTP</label>
            <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0,6))} placeholder="6-digit code"
                   className="w-full p-3 text-lg text-center tracking-widest rounded-md border border-slate-200" />
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-slate-600">Expires in <span className="font-medium">{formatTime(secondsLeft)}</span></div>
          <div className="flex gap-2">
            {method !== 'whatsapp' && (
              <button disabled={loading} onClick={requestOtp} className="px-3 py-2 bg-white border rounded-md text-sm">Resend</button>
            )}
            <button disabled={loading || (method === 'whatsapp' && !whatsappOtp)} onClick={verifyOtp} className="px-4 py-2 bg-sky-600 text-white rounded-md text-sm">Verify</button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <button onClick={() => navigate(-1)} className="text-sm text-slate-600">Back</button>
          <button onClick={skipVerification} disabled={loading} className="text-sm text-rose-600">Skip verification</button>
        </div>

        {message && <div className="mt-4 p-3 bg-slate-50 rounded-md text-sm">{message}</div>}
      </div>
    </div>
  );
}
