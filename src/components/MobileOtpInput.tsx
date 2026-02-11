import React, { useState } from 'react'

type Props = {
  orderId: string
}

export default function MobileOtpInput({ orderId }: Props) {
  const [phone, setPhone] = useState('')
  const [method, setMethod] = useState<'sms'|'email'>('sms')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [requested, setRequested] = useState(false)

  const requestOtp = async () => {
    if (method === 'sms' && phone.length !== 11) { setMessage('Phone must be 11 digits'); return }
    try {
      const res = await fetch(`/api/orders/${orderId}/request-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, method })
      })
      if (res.ok) { setRequested(true); setMessage(method === 'sms' ? 'OTP requested — check your phone.' : 'OTP requested — check your email.') }
      else setMessage('Failed to request OTP')
    } catch (e) {
      setMessage('Network error')
    }
  }

  const verifyOtp = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/verify-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, otp })
      })
      const j = await res.json()
      if (res.ok) setMessage('OTP verified — order confirmed')
      else setMessage(j.message || 'Invalid OTP')
    } catch (e) { setMessage('Network error') }
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Confirm by mobile</h3>
      <p className="text-sm text-gray-600 mb-4">Enter your 11-digit mobile number to receive an OTP.</p>
      <div className="flex gap-2">
        <select value={method} onChange={e=>setMethod(e.target.value as any)} className="border rounded px-3 py-2">
          <option value="sms">SMS</option>
          <option value="email">Email</option>
        </select>
        <input
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          placeholder="e.g. 01123456789 or email@example.com"
          value={phone}
          onChange={e => setPhone(e.target.value.replace(/[^0-9@.]/g, '').slice(0,64))}
        />
        <button className="bg-teal-500 text-white px-3 py-2 rounded" onClick={requestOtp}>Send OTP</button>
      </div>

      {requested && (
        <div className="mt-4">
          <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Enter OTP" value={otp} onChange={e=>setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0,8))} />
          <div className="flex gap-2">
            <button className="bg-green-600 text-white px-3 py-2 rounded flex-1" onClick={verifyOtp}>Verify OTP</button>
          </div>
        </div>
      )}

      {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
    </div>
  )
}
