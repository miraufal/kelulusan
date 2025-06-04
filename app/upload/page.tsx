'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Nilai = { mapel: string; nilai: string };

export default function UploadData() {
  const [form, setForm] = useState({
    nisn: '',
    nama: '',
    no_peserta: '',
    status: '',
  });
  const [nilai, setNilai] = useState<Nilai[]>([{ mapel: '', nilai: '' }]);
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleNilaiChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newNilai = [...nilai];
    newNilai[i][name as keyof Nilai] = value;
    setNilai(newNilai);
  }

  const addNilaiRow = () => setNilai([...nilai, { mapel: '', nilai: '' }])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    // 1. Insert ke kelulusan
    const { data: kelulusanData, error: kelulusanError } = await supabase
      .from('kelulusan')
      .insert([{ ...form }])
      .select('id') // ambil id hasil insert
      .single()

    if (kelulusanError || !kelulusanData) {
      setMsg('Gagal upload data kelulusan! ' + (kelulusanError?.message || ''))
      setLoading(false)
      return
    }

    // 2. Insert ke nilai (jika ada)
    const nilaiRows = nilai
      .filter(n => n.mapel && n.nilai)
      .map(n => ({
        kelulusan_id: kelulusanData.id,
        mapel: n.mapel,
        nilai: Number(n.nilai)
      }))

    if (nilaiRows.length > 0) {
      const { error: nilaiError } = await supabase
        .from('nilai')
        .insert(nilaiRows)
      if (nilaiError) {
        setMsg('Data kelulusan masuk, tapi gagal upload nilai! ' + nilaiError.message)
        setLoading(false)
        return
      }
    }

    setMsg('Data berhasil diupload!')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col items-center px-4 py-12">
      <div className="p-8 w-full max-w-xl bg-white rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">Upload Data Kelulusan</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nisn"
            placeholder="NISN"
            value={form.nisn}
            onChange={handleChange}
            className="w-full bg-gray-100 px-4 py-2 rounded"
            required
          />
          <input
            type="text"
            name="nama"
            placeholder="Nama"
            value={form.nama}
            onChange={handleChange}
            className="w-full bg-gray-100 px-4 py-2 rounded"
            required
          />
          <input
            type="text"
            name="no_peserta"
            placeholder="No Peserta"
            value={form.no_peserta}
            onChange={handleChange}
            className="w-full bg-gray-100 px-4 py-2 rounded"
            required
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full bg-gray-100 px-4 py-2 rounded"
            required
          >
            <option value="">Pilih Status</option>
            <option value="LULUS">LULUS</option>
            <option value="TIDAK LULUS">TIDAK LULUS</option>
          </select>
          <div>
            <label className="font-semibold text-gray-700">Nilai:</label>
            {nilai.map((n, i) => (
              <div key={i} className="flex gap-2 mt-2">
                <input
                  type="text"
                  name="mapel"
                  placeholder="Mata Pelajaran"
                  value={n.mapel}
                  onChange={e => handleNilaiChange(i, e)}
                  className="bg-gray-100 px-2 py-1 rounded flex-1"
                  required
                />
                <input
                  type="number"
                  name="nilai"
                  placeholder="Nilai"
                  value={n.nilai}
                  onChange={e => handleNilaiChange(i, e)}
                  className="bg-gray-100 px-2 py-1 rounded w-24"
                  required
                />
              </div>
            ))}
            <button type="button" onClick={addNilaiRow} className="mt-2 text-blue-600 hover:underline text-sm">
              + Tambah Mata Pelajaran
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow"
            disabled={loading}
          >
            {loading ? 'Mengupload...' : 'Upload'}
          </button>
          {msg && (
            <div className="mt-3 text-center text-sm text-green-600">{msg}</div>
          )}
        </form>
      </div>
    </div>
  )
}