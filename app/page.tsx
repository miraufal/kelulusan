'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

type Nilai = {
  mapel: string;
  nilai: number;
};

type Siswa = {
  nisn: string;
  nama: string;
  no_peserta: string;
  status: string;
  file_skl_url?: string;
  nilai: Nilai[];
};

export default function Home() {
  const [nisn, setNisn] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<Siswa | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setData(null)

    const { data: siswa, error } = await supabase
      .from('kelulusan')
      .select('nisn, nama, no_peserta, status, file_skl_url, nilai(mapel, nilai)')
      .eq('nisn', nisn)
      .single()

    if (error || !siswa) {
      setError('Data tidak ditemukan.')
    } else {
      setData(siswa as Siswa)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-white flex flex-col items-center px-2 sm:px-4 py-6 sm:py-12">
      <div className="p-4 sm:p-8 w-full max-w-2xl flex flex-col items-center">
        {/* Custom Image */}
        <Image
          src="/logo-kelulusan.jpg"
          alt="Logo Kelulusan"
          width={128}
          height={128}
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mb-4 drop-shadow-lg"
          priority
        />
        <div className="text-center mb-8 w-full">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">PENGUMUMAN KELULUSAN</h1>
          <h1 className="text-2xl font-bold text-gray-700 tracking-tight">MI RAUDLOTUL ATHFAL TP 2024-2025</h1>
          <p className="mt-2 text-gray-600 text-base">Masukkan NISN untuk melihat status kelulusan</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl flex flex-wrap gap-2 bg-gray-100 shadow-2xl rounded-xl p-2 border border-gray-200 transition-all focus-within:shadow-2xl"
        >
          <input
            type="text"
            placeholder="Masukkan NISN"
            value={nisn}
            onChange={(e) => setNisn(e.target.value)}
            className="flex-grow min-w-0 bg-gray-100 border-none px-4 py-3 rounded-full focus:outline-none text-lg text-gray-800 placeholder-gray-400"
            autoFocus
          />
          <button
            type="submit"
            className="w-md sm:w-md bg-blue-500 hover:bg-blue-700 transition text-white px-4 sm:px-6 py-2 rounded-full font-semibold shadow-xl disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"/>
                </svg>
                Mencari...
              </span>
            ) : 'Cari'}
          </button>
        </form>

        {error && (
          <div className="mt-6 text-red-600 bg-red-100/80 px-4 py-2 rounded-lg shadow max-w-xl w-full text-center border border-red-200">
            {error}
          </div>
        )}

        {data && (
          <div className="mt-6 w-full max-w-xl bg-white rounded-3xl shadow-2xl p-4 sm:p-8 border border-gray-100 animate-fade-in">
            <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
              <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Data Kelulusan
            </h2>
            <div className="grid gap-3 text-gray-800 mb-6">
              <div className="flex items-center">
                <span className="ml-8 w-32 font-medium text-gray-500">NISN</span>
                <span className="font-semibold">{data.nisn}</span>
              </div>
              <div className="flex items-center">
                <span className="ml-8 w-32 font-medium text-gray-500">Nama</span>
                <span className="font-semibold">{data.nama}</span>
              </div>
              <div className="flex items-center">
                <span className="ml-8 w-32 font-medium text-gray-500">No Peserta</span>
                <span className="font-semibold">{data.no_peserta}</span>
              </div>
              <div className="flex items-center">
                <span className="ml-8 w-32 font-medium text-gray-500">Status</span>
                <span className={`font-bold px-3 py-1 rounded-full ${data.status === 'LULUS' ? 'bg-blue-100 text-blue-700' : 'bg-green-200 text-green-800'}`}>
                  {data.status}
                </span>
              </div>
            </div>

            <h3 className="font-semibold text-gray-700 mb-2">Nilai</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full rounded-xl border border-gray-200 overflow-hidden text-sm sm:text-base">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-4 py-2 text-left text-gray-600 font-semibold">Mata Pelajaran</th>
                    <th className="px-4 py-2 text-left text-gray-600 font-semibold">Nilai</th>
                  </tr>
                </thead>
                <tbody>
                  {data.nilai.map((n, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      <td className="px-4 py-2">{n.mapel}</td>
                      <td className="px-4 py-2 font-bold text-gray-700">{n.nilai}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.file_skl_url && (
              <a
                href={data.file_skl_url}
                className="mt-8 inline-block bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full hover:from-green-600 hover:to-green-700 transition font-semibold shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
                download
              >
                Unduh SKL
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
