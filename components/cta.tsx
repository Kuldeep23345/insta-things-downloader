import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
    <div className="bg-linear-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl mb-20 relative overflow-hidden">
      <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
        <div className="flex justify-center md:justify-start h-full w-full">
          <img
            src="/app.webp"
            alt="Mobile App Mockup"
            className="h-full rounded-lg"
          />
        </div>

        {/* Content */}
        <div className="text-center md:text-left ">
          <h2 className="text-3xl md:text-4xl font-bold mt-16 text-white mb-6">
            Download with mobile app
          </h2>
          <p className="text-white/90 text-lg leading-relaxed mb-8">
            Download any photos, videos, reels, IGTV in one click! Our app
            provides fast, high-resolution downloads without watermarks, making
            it an ideal choice for downloading Instagram content.
          </p>
          <Button
            size="lg"
            className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mb-16"
          >
            <Download className="w-5 h-5 mr-3" />
            Install now
          </Button>
        </div>
      </div>
    </div>
  );
}
