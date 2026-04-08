"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clipboard,
  Video,
  Camera,
  Film,
  BookOpen,
  Tv,
  RotateCcw,
  Eye,
} from "lucide-react";
import Header from "@/components/header";
import CTA from "@/components/cta";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { getPostShortcode } from "@/lib/utils";
import { useGetInstagramPost } from "@/graphql/request";
import { HTTP_CODE_ENUM } from "@/graphql/http-codes";
import HowToDownload from "@/components/how-to-download";

const contentTypes = [
  {
    id: "video",
    icon: Video,
    emoji: "📹",
    label: "Video",
    title: "Instagram Video Downloader",
    description:
      "Snsta supports Instagram video download for singular videos and multiple videos from carousels.",
  },
  {
    id: "photo",
    icon: Camera,
    emoji: "📷",
    label: "Photo",
    title: "Instagram Photo Downloader",
    description:
      "Instagram photo download provided by Snsta is a great tool for saving images from Instagram posts.",
  },
  {
    id: "reels",
    icon: Film,
    emoji: "🎬",
    label: "Reels",
    title: "Instagram Reels Downloader",
    description:
      "Download Instagram Reels effortlessly with Snsta's specialized Reels downloader.",
  },
  // {
  //   id: "story",
  //   icon: BookOpen,
  //   emoji: "📖",
  //   label: "Story",
  //   title: "Instagram Story Downloader (Under Development)",
  //   description:
  //     "Functionality to download Instagram Stories is coming soon. Currently, this feature is a placeholder.",
  // },
  {
    id: "igtv",
    icon: Tv,
    emoji: "📺",
    label: "IGTV",
    title: "Instagram IGTV Downloader",
    description:
      "Snsta's IGTV downloader allows you to save long-form Instagram videos directly to your device.",
  },
  {
    id: "carousel",
    icon: RotateCcw,
    emoji: "🎠",
    label: "Carousel",
    title: "Instagram Carousel Downloader",
    description:
      "Download entire Instagram carousel posts with Snsta's carousel downloader.",
  },
  {
    id: "viewer",
    icon: Eye,
    emoji: "👁️",
    label: "Viewer",
    title: "Instagram Content Viewer",
    description:
      "Snsta's Instagram viewer allows you to browse and preview Instagram content.",
  },
];

function triggerDownload(mediaUrl: string, mediaType: string) {
  if (typeof window === "undefined") return;

  const randomTime = new Date().getTime().toString().slice(-8);
  const extension = mediaType === "photo" ? "jpg" : "mp4";
  const filename = `Snsta-${randomTime}.${extension}`;

  const proxyUrl = new URL("/api/download-proxy", window.location.origin);
  proxyUrl.searchParams.append("url", mediaUrl);
  proxyUrl.searchParams.append("filename", filename);

  const link = document.createElement("a");
  link.href = proxyUrl.toString();
  link.target = "_blank";
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function copyToClipboard(text: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    return false;
  }
}

export default function HomePage() {
  const [activeContentType, setActiveContentType] = useState("video");
  const [inputLink, setInputLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mediaPreviewData, setMediaPreviewData] = useState<any>(null); // Stores the media data for preview
  const [currentShortcode, setCurrentShortcode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // Stores error messages
  const inputRef = useRef<HTMLInputElement>(null);
  const getInstagramPost = useGetInstagramPost();

  const currentContent =
    contentTypes.find((type) => type.id === activeContentType) ||
    contentTypes[0];

  const handleSubmit = async () => {
    if (!inputLink) {
      toast.error("Please enter a valid Instagram URL");
      return;
    }

    const shortcode = getPostShortcode(inputLink);

    if (!shortcode) {
      toast.error("Invalid Instagram URL. Please check the link.");
      return;
    }

    setIsLoading(true);
    setMediaPreviewData(null);
    setError(null);

    if (activeContentType === "story") {
      try {
        const response = await fetch("/api/instagram/story");
        const result = await response.json();

        if (response.ok && result.status === "info") {
          setError(result.message);
          setMediaPreviewData(null);
          toast.info(result.message, {
            id: "toast-info-story",
            position: "top-center",
            duration: 6000,
          });
        } else {
          const errMessage =
            result.message || "Failed to get story information.";
          setError(errMessage);
          setMediaPreviewData(null);
          toast.error(errMessage, {
            id: "toast-error-story",
            position: "top-center",
            duration: 3000,
          });
        }
      } catch (e: any) {
        console.error("Story fetch error:", e);
        const errorMessage =
          e.message ||
          "An unexpected error occurred while checking story status.";
        setError(errorMessage);
        setMediaPreviewData(null);
        toast.error(errorMessage, {
          dismissible: true,
          id: "toast-error-story-catch",
          position: "top-center",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle other content types (video, photo, carousel, etc.)
      if (!shortcode) {
        // shortcode is already derived before this outer try-catch
        toast.error(
          "Invalid Instagram URL for this content type. Please check the link.",
        );
        setIsLoading(false); // Ensure loading is stopped
        setError(
          "Invalid Instagram URL for this content type. Please check the link.",
        ); // Set error state
        return;
      }
      try {
        const { data, status } = await getInstagramPost({ shortcode });

        if (status === HTTP_CODE_ENUM.OK && (data as any).mediaData) {
          setMediaPreviewData((data as any).mediaData);
          setCurrentShortcode(shortcode);
          setError(null);
          toast.success("Content ready for preview!", {
            id: "toast-success-preview",
            position: "top-center",
            duration: 1500,
          });
        } else {
          let friendlyMessage =
            "An unexpected error occurred. Please try again.";
          let errorKey: string | undefined;

          if (data && "error" in data) {
            errorKey = data.error;
            switch (errorKey) {
              case "notFound":
                friendlyMessage =
                  "Post not found. It might be a private account, the link is incorrect, or the post has been deleted.";
                break;
              case "noShortcode":
                friendlyMessage =
                  "Invalid Instagram URL. Please check the link and try again.";
                break;
              case "tooManyRequests":
                friendlyMessage =
                  "We're experiencing high traffic. Please try again in a few minutes.";
                break;
              case "serverError":
                friendlyMessage =
                  "A server error occurred while fetching the post. Please try again later.";
                break;
              default:
                friendlyMessage =
                  data.message ||
                  `An unknown error occurred (Code: ${errorKey}). Please try again.`;
            }
          } else if (status !== HTTP_CODE_ENUM.OK) {
            friendlyMessage = `Failed to fetch content. Server responded with status ${status}.`;
          }

          setError(friendlyMessage);
          setMediaPreviewData(null);
          setCurrentShortcode(null);
          toast.error(friendlyMessage, {
            id: `toast-error-${errorKey || "http-" + status}`,
            position: "top-center",
            duration: 3000,
          });
        }
      } catch (e: any) {
        console.error("Catch block error (post):", e);
        const errorMessage =
          e.message ||
          "A network error or unexpected issue occurred. Please check your connection and try again.";
        setError(errorMessage);
        setMediaPreviewData(null);
        toast.error(errorMessage, {
          dismissible: true,
          id: "toast-error-catch-all-post",
          position: "top-center",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Update handlePaste to clear previews and errors
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputLink(text);
      setMediaPreviewData(null);
      setCurrentShortcode(null);
      setError(null);
    } catch (err) {
      console.error("Failed to read clipboard contents:", err);
      toast.error("Failed to read clipboard.");
    }
  };

  const handleClear = () => {
    setInputLink("");
    setMediaPreviewData(null);
    setCurrentShortcode(null);
    setError(null);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputLink(e.target.value);
    if (mediaPreviewData || error) {
      setMediaPreviewData(null);
      setCurrentShortcode(null);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      <Header />

      <section
        className="px-4 py-24 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #002296 0%, #82008F 16%, #C0007A 32%, #EA0C5F 48%, #FF5341 64%, #FF8820 80%, #F6BA00 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto text-center relative z-10 mt-16">
          <div className="flex flex-wrap justify-center items-center gap-2 mb-8 px-2 rounded-md bg-white/20 backdrop-blur-3xl w-fit mx-auto">
            {contentTypes.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setActiveContentType(item.id)}
                className={`flex border-r border-r-gray-200/40 items-center justify-center gap-1.5 px-4 py-3 transition-all duration-200 hover:text-white/50 text-white ${
                  index === contentTypes.length - 1 ? "border-r-0" : ""
                }`}
                style={{ minWidth: 70 }}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
            {currentContent.title}
          </h1>
          <p className="text-white/90 text-lg mb-8 tracking-wide">
            Download Instagram Videos, Photos, Reels, IGTV & carousel
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 bg-white/95 backdrop-blur-sm rounded-xl p-3 shadow-2xl">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  placeholder="Insert instagram link here"
                  className="border-0 h-10 focus-visible:ring-0 text-gray-600 placeholder:text-gray-400 bg-transparent shadow-none"
                  value={inputLink}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  type="url"
                  autoComplete="off"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all duration-300 h-10"
                  onClick={handlePaste}
                >
                  <Clipboard className="w-4 h-4 mr-2" />
                  Paste
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-200 hover:border-gray-300 hover:text-gray-700 transition-all duration-300 h-10"
                  onClick={handleClear}
                >
                  Clear
                </Button>
                <Button
                  className="bg-blue-600 h-10 hover:bg-blue-700 px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={handleSubmit}
                  disabled={isLoading || !inputLink}
                >
                  {isLoading ? "Downloading..." : "Download"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 relative z-10">
        {/* Preview Section */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
            <p className="text-center font-medium">Error:</p>
            <p className="text-center">{error}</p>
          </div>
        )}

        {mediaPreviewData && !error && (
          <div className="max-w-4xl mx-auto mb-12">
            {currentShortcode && (
              <div className="flex items-center justify-center mb-4 gap-3">
                <div className="px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-700">
                  Shortcode:{" "}
                  <span className="font-mono">{currentShortcode}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const ok = await copyToClipboard(currentShortcode);
                    if (ok) toast.success("Copied shortcode");
                    else toast.error("Failed to copy shortcode");
                  }}
                >
                  Copy Shortcode
                </Button>
              </div>
            )}
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
              Preview
            </h2>
            {mediaPreviewData.type === "photo" && (
              <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-lg bg-white">
                <img
                  src={`/api/download-proxy?url=${encodeURIComponent(
                    mediaPreviewData.url,
                  )}`}
                  alt="Instagram Photo Preview"
                  className="max-w-full md:max-w-md h-auto rounded-md shadow"
                />
                <Button
                  onClick={() => triggerDownload(mediaPreviewData.url, "photo")}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Photo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const ok = await copyToClipboard(mediaPreviewData.url);
                    if (ok) toast.success("Copied photo URL to clipboard");
                    else toast.error("Failed to copy URL");
                  }}
                >
                  Copy URL
                </Button>
              </div>
            )}

            {mediaPreviewData.type === "video" && (
              <div className="flex flex-col items-center gap-4 p-4 border rounded-lg shadow-lg bg-white">
                <video
                  src={`/api/download-proxy?url=${encodeURIComponent(
                    mediaPreviewData.url,
                  )}`}
                  controls
                  className="max-w-full md:max-w-md h-auto rounded-md shadow"
                >
                  Your browser does not support the video tag.
                </video>
                <Button
                  onClick={() => triggerDownload(mediaPreviewData.url, "video")}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Video
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const ok = await copyToClipboard(mediaPreviewData.url);
                    if (ok) toast.success("Copied video URL to clipboard");
                    else toast.error("Failed to copy URL");
                  }}
                >
                  Copy URL
                </Button>
              </div>
            )}

            {mediaPreviewData.type === "carousel" && (
              <div className="p-4 border rounded-lg shadow-lg bg-white">
                <h3 className="text-2xl font-semibold text-center mb-6 text-gray-700">
                  Carousel Items
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mediaPreviewData.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex flex-col items-center gap-3 p-3 border rounded-md shadow-md bg-gray-50"
                    >
                      {item.type === "photo" && (
                        <>
                          <img
                            src={`/api/download-proxy?url=${encodeURIComponent(
                              item.url,
                            )}`}
                            alt={`Carousel Item ${index + 1} - Photo`}
                            className="w-full h-auto rounded object-cover aspect-square"
                          />
                          <Button
                            onClick={() => triggerDownload(item.url, "photo")}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white w-full"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Photo
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              const ok = await copyToClipboard(item.url);
                              if (ok) toast.success("Copied item URL");
                              else toast.error("Failed to copy URL");
                            }}
                            className="w-full mt-2"
                          >
                            Copy URL
                          </Button>
                        </>
                      )}
                      {item.type === "video" && (
                        <>
                          <video
                            src={`/api/download-proxy?url=${encodeURIComponent(
                              item.url,
                            )}`}
                            controls
                            className="w-full h-auto rounded object-cover aspect-square"
                          >
                            Your browser does not support the video tag.
                          </video>
                          <Button
                            onClick={() => triggerDownload(item.url, "video")}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white w-full"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Video
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              const ok = await copyToClipboard(item.url);
                              if (ok) toast.success("Copied item URL");
                              else toast.error("Failed to copy URL");
                            }}
                            className="w-full mt-2"
                          >
                            Copy URL
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="order-2 md:order-1">
              <div className="bg-linear-to-br from-purple-500 via-pink-500 to-orange-400 rounded-2xl p-8 relative overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
                <div className="relative z-10 flex items-center justify-center">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-linear-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded transform rotate-45"></div>
                      </div>
                      <span className="font-bold text-purple-600">Snsta</span>
                    </div>
                    <div className="w-16 h-16 bg-linear-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <currentContent.icon className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Camera className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                      <Film className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold text-blue-600 mb-4">
                {currentContent.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {currentContent.description}
              </p>
            </div>
          </div>
          <HowToDownload />
          <CTA />
        </div>
      </section>
    </div>
  );
}
