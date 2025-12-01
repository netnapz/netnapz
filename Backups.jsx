// pages/Backups.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Archive, Download, Upload, Home, Shield } from 'lucide-react';

export default function Backups() {
  return (
    <div className="min-h-screen p-4 relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6907bbc1d9a3081c7edf7dd0/de7781c73_create-a-cool-grafity-logo-for-red-splat-handprint-with-the-text-netnapzpunk-style-high-quality.jpg"
          alt="NetNapz Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/90"></div>
        <div className="absolute inset-0 bg-[size:50px_50px] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to={createPageUrl("Home")} className="inline-flex items-center gap-3 group mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl border-3 border-yellow-400">
                <span className="text-3xl font-black text-white">N</span>
              </div>
            </div>
            <span className="text-4xl font-black text-black">NetNapz</span>
          </Link>
          <h1 className="text-3xl font-black text-black mb-2">Backups</h1>
          <p className="text-gray-600 font-bold">Secure your creations with automated backups</p>
        </div>

        {/* Backup Content */}
        <div className="cartoon-glass border-3 border-black p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4 border-3 border-black">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-black mb-2">Backup & Restore</h2>
            <p className="text-gray-600">Keep your AI creations safe and secure</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="cartoon-btn bg-white border-2 border-black p-6 rounded-2xl text-center">
              <Download className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-black text-black mb-2">Export Backup</h3>
              <p className="text-gray-600 mb-4">Download all your creations as a backup file</p>
              <Button className="cartoon-btn bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold">
                <Download className="w-4 h-4 mr-2" />
                Export Now
              </Button>
            </div>

            <div className="cartoon-btn bg-white border-2 border-black p-6 rounded-2xl text-center">
              <Upload className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-black text-black mb-2">Import Backup</h3>
              <p className="text-gray-600 mb-4">Restore your creations from a backup file</p>
              <Button className="cartoon-btn bg-gradient-to-r from-orange-400 to-red-400 text-white font-bold">
                <Upload className="w-4 h-4 mr-2" />
                Import Backup
              </Button>
            </div>
          </div>

          {/* Auto Backup Settings */}
          <div className="cartoon-btn bg-yellow-100 border-2 border-black p-6 rounded-2xl">
            <h3 className="text-xl font-black text-black mb-4 flex items-center gap-2">
              <Archive className="w-5 h-5" />
              Automatic Backups
            </h3>
            <p className="text-gray-700 mb-4">
              Your creations are automatically backed up to your browser's storage. 
              For additional security, export your backup file regularly.
            </p>
            <div className="bg-white border-2 border-black rounded-xl p-4">
              <p className="text-sm text-gray-600 font-bold">
                💡 <strong>Pro Tip:</strong> Export your backup before clearing browser data!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="text-center mt-8">
          <Link to={createPageUrl("Home")}>
            <Button className="cartoon-btn bg-white border-2 border-black text-black font-bold">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}