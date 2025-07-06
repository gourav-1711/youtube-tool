"use client";
import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Music,
  Video,
  Search,
  Play,
  Clock,
  Eye,
  Loader2Icon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function HomeComponent() {
  const [btnLoading, setBtnLoading] = useState(false);
  const [ytUrl, setYtUrl] = useState("");
  const [ytFormat, setYtFormat] = useState("mp3");

  const [preview, setPreview] = useState(false);

  const [apiData, setApiData] = useState(null);
  const [downloadUrlData, setDownloadUrlData] = useState(null);

  const [downloadReady, setDownloadReady] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [finalDownloadUrl, setFinalDownloadUrl] = useState("");

  const [thumbnailQuality, setThumbnailQuality] = useState("maxresdefault");

  // console.log(ytFormat)

  const status = async (id) => {
    setBtnLoading(true);
    const options = {
      method: "GET",
      url: "https://youtube-info-download-api.p.rapidapi.com/ajax/download.php",
      params: {
        format: "mp3",
        add_info: "0",
        url: ytUrl,
        audio_quality: "128",
        allow_extended_duration: "false",
      },
      headers: {
        "x-rapidapi-key": "5f0323ef84msh745b88c630bfac5p1485abjsn7b94adffcce0",
        "x-rapidapi-host": "youtube-info-download-api.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log("Initial API response:", response.data);
      setApiData(response.data);
      // Start polling download progress if it's an mp3
      if (ytFormat === "mp3" && response.data.progress_url) {
        download(response.data.progress_url);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const download = async (progressUrl) => {
    setCheckingStatus(true);
    setDownloadReady(false);

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(progressUrl);
        console.log("Polling response:", res.data);

        if (res.data.success === 1 && res.data.download_url) {
          clearInterval(interval);
          setFinalDownloadUrl(res.data.download_url);
          setDownloadReady(true);
          setCheckingStatus(false);
          setBtnLoading(false);
        }
      } catch (error) {
        console.error("Polling error:", error);
        clearInterval(interval);
        setCheckingStatus(false);
        setBtnLoading(false);
      }
    }, 3000);
  };

  const [videoId, setVideoId] = useState("");

  // show preview
  const extractYouTubeId = (url) => {
    try {
      const regExp =
        /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|watch\?.+&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[1].length === 11 ? match[1] : null;
    } catch {
      return null;
    }
  };

  const apiCall = () => {
    const id = extractYouTubeId(ytUrl);
    if (id) {
      setDownloadReady(false);
      setFinalDownloadUrl("");
      setCheckingStatus(false);
      setApiData(null);

      setVideoId(id);
      setPreview(true);
      status(id);
    } else {
      alert("Invalid YouTube URL");
    }
  };

  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/${thumbnailQuality}.jpg`
    : "";

  const thumbDownload = () => {
    const id = extractYouTubeId(ytUrl);
    setVideoId(id);
    setPreview(true);
  };

  const downloadThumbnail = async (quality) => {
    const url = `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
    const response = await fetch(url, { mode: "no-cors" });
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = `thumbnail-${videoId}-${quality}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  return (
    <>
      <Header />
      {/* too start here */}
      <div>
        <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">YouTube Downloader</h1>
            <p className="text-muted-foreground">
              Download YouTube Thumbnail and audio with ease
            </p>
            <p className="text-muted-foreground">
              Make Sure You Have Rights To Download YouTube Content
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Enter YouTube URL
              </CardTitle>
              <CardDescription>
                Paste a YouTube video URL to preview and download
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type={"text"}
                  value={ytUrl}
                  onChange={(e) => setYtUrl(e.target.value)}
                  placeholder="your_video_url"
                  className="flex-1"
                />
                {btnLoading ? (
                  <Button size="sm" disabled>
                    <Loader2Icon className="animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button onClick={ytFormat == "mp3" ? apiCall : thumbDownload}>
                    Download
                  </Button>
                )}
              </div>

              <div className="format w-full">
                <Select
                  className="w-full"
                  value={ytFormat}
                  onValueChange={(value) => setYtFormat(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select A Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Availible Format </SelectLabel>
                      <SelectItem value="thumbnail">Thumbnail</SelectItem>
                      <SelectItem value="mp3">Audio</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {/* youtube video preview */}
              {preview ? (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <iframe
                      width="670"
                      height="377"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="Ed Sheeran - Sapphire (Official Music Video)"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="max-w-full"
                    ></iframe>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center border p-5">
                  Insert Url To Preview
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs value={ytFormat} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="mp4"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Video className="w-4 h-4" />
                Thumbnail Download
              </TabsTrigger>
              <TabsTrigger
                value="mp3"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Music className="w-4 h-4" />
                Audio Download
              </TabsTrigger>
            </TabsList>

            <TabsContent value="thumbnail" className="space-y-4">
              {videoId ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Thumbnail Download
                    </CardTitle>
                    <CardDescription>
                      Select your preferred thumbnail resolution and download
                      it.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3">
                      {[
                        {
                          label: "Ultra HD (2160p)",
                          quality: "maxresdefault",
                          badge: "4K",
                        },
                        {
                          label: "Full HD (1080p)",
                          quality: "hqdefault",
                          badge: "HD",
                        },
                        {
                          label: "Standard (720p)",
                          quality: "sddefault",
                          badge: "SD",
                        },
                        {
                          label: "Mobile (480p)",
                          quality: "mqdefault",
                          badge: "Mobile",
                        },
                      ].map(({ label, quality, badge }) => (
                        <div
                          key={quality}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={
                                quality === "maxresdefault"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {badge}
                            </Badge>
                            <p className="font-medium">{label}</p>
                          </div>
                          <a
                            href={`https://img.youtube.com/vi/${videoId}/${quality}.jpg`}
                            download={`thumbnail-${videoId}-${quality}.jpg`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant={
                                quality === "maxresdefault"
                                  ? "default"
                                  : "outline"
                              }
                              className="flex items-center gap-2"
                              
                              onClick={() =>{  
                                downloadThumbnail(quality)
                                setThumbnailQuality(quality)}}
                            >
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                          </a>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h3 className="text-center text-muted-foreground text-sm">
                        Preview
                      </h3>
                      <img
                        src={thumbnailUrl}
                        alt="YouTube Thumbnail"
                        className="w-full rounded-lg mt-4"
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center border p-5">
                  Insert a valid URL to preview
                </div>
              )}
            </TabsContent>

            <TabsContent value="mp3" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5" />
                    Audio Download Options
                  </CardTitle>
                  <CardDescription>
                    Extract audio in your preferred format and quality
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Standard</Badge>
                        <div>
                          <p className="font-medium">MP3 128kbps</p>
                          <p className="text-sm text-muted-foreground">
                            Standard quality •
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          if (finalDownloadUrl) window.open(finalDownloadUrl);
                        }}
                        disabled={!downloadReady}
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent"
                      >
                        {checkingStatus ? (
                          <>
                            <Loader2Icon className="w-4 h-4 animate-spin" />
                            Preparing...
                          </>
                        ) : downloadReady ? (
                          <>
                            <Download className="w-4 h-4" />
                            Download
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Not Ready
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* <Card className="bg-muted/50">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Note:</strong> This is a demo interface. In a real
                implementation, you would need backend services to handle
                YouTube video processing and downloading, which requires proper
                API keys and compliance with YouTube's terms of service.
              </p>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </>
  );
}
