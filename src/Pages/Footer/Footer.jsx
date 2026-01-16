import React from "react";
import { Mail, Phone, MapPin, GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* University Project Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-bold text-white">University Project</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              ExamDesk - A comprehensive exam preparation platform developed as a university project.
            </p>
            <p className="text-xs text-gray-400 pt-2">
              Jashore University of Science and Technology
            </p>
          </div>

          {/* Supervisor */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white mb-4">Project Supervisor</h3>
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
              <p className="text-sm font-bold text-white">Md. Kamrul Islam, PhD</p>
              <p className="text-xs text-gray-300 mt-1">Associate Professor</p>
              <p className="text-xs text-gray-300 mb-3">Jashore University of Science and Technology</p>
              <div className="space-y-1 pt-2 border-t border-gray-700">
                <a
                  href="mailto:kamrul@example.com"
                  className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors text-xs"
                >
                  <Mail className="w-3 h-3" />
                  [Add Supervisor Email]
                </a>
                <a
                  href="tel:+8801234567890"
                  className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors text-xs"
                >
                  <Phone className="w-3 h-3" />
                  [Add Supervisor Phone]
                </a>
              </div>
            </div>
          </div>

          {/* Developers */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4">Development Team</h3>
            
            {/* Main Developer */}
            <div>
              <p className="text-xs font-semibold text-blue-400 mb-1">Main Developer</p>
              <p className="text-sm font-bold text-white mb-2">Sadik Mahmud Raihan</p>
              <div className="space-y-1">
                <a
                  href="tel:+8801774651008"
                  className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors text-xs"
                >
                  <Phone className="w-3 h-3" />
                  +880 1774-651008
                </a>
                <a
                  href="mailto:sadikmahmudraihan@gmail.com"
                  className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors text-xs"
                >
                  <Mail className="w-3 h-3" />
                  sadikmahmudraihan@gmail.com
                </a>
                <div className="flex items-center gap-2 text-gray-300 text-xs">
                  <MapPin className="w-3 h-3" />
                  Naogaon, Rajshahi, Bangladesh
                </div>
              </div>
            </div>

            {/* Co-Developer */}
            <div className="pt-2 border-t border-gray-700">
              <p className="text-xs font-semibold text-blue-400 mb-1">Co-Developer</p>
              <p className="text-sm font-bold text-white">Mobasher Alam</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-black/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-sm text-gray-400 text-center md:text-left">
              © {new Date().getFullYear()} ExamDesk. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 text-center md:text-right">
              Developed by Sadik Mahmud Raihan & Mobasher Alam
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
