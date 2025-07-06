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
  const videoInfo = {
    title: "Sample YouTube Video Title - Amazing Content",
    duration: "10:45",
    views: "1.2M views",
    thumbnail: "/placeholder.svg?height=180&width=320",
    channel: "Sample Channel",
  };
  const [btnLoading, setBtnLoading] = useState(false);
  const [ytUrl, setYtUrl] = useState("");
  const [ytFormat, setYtFormat] = useState("mp3");

  const [preview, setPreview] = useState(false);

  const [apiData , setApiData] = useState(null)

  console.log(ytFormat);

  const status = async (id) => {
    const options = {
      method: "GET",
      url: `https://youtube-to-mp315.p.rapidapi.com/status/${id}`,
      headers: {
        "x-rapidapi-key": "5f0323ef84msh745b88c630bfac5p1485abjsn7b94adffcce0",
        "x-rapidapi-host": "youtube-to-mp315.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      setApiData(response.data)
    } catch (error) {
      console.error(error);
    } finally {
      setBtnLoading(false);
    }
  };

  const convert = async () => {
    setBtnLoading(true);

    const options = {
      method: "POST",
      url: "https://youtube-to-mp315.p.rapidapi.com/download",
      params: {
        url: ytUrl,
        format: "mp3",
      },
      headers: {
        "x-rapidapi-key": "5f0323ef84msh745b88c630bfac5p1485abjsn7b94adffcce0",
        "x-rapidapi-host": "youtube-to-mp315.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {},
    };

    try {
      const response = await axios.request(options);
      // console.log(response.data);
      // setApiData(response.data)
      status(response.data.id)
    } catch (error) {
      console.error(error);
    }
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
    convert();

    const id = extractYouTubeId(ytUrl);
    if (id) {
      setVideoId(id);
      setPreview(true)
    } else {
      alert("Invalid YouTube URL");
    }


   
    
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
              Download YouTube videos and audio with ease
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
                  value={ytUrl}
                  defaultValue={
                    "https://youtu.be/JgDNFQ2RaLQ?si=3OWpyQe5NFgREn39"
                  }
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
                  <Button onClick={apiCall}>Download</Button>
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
                      <SelectItem value="mp4">Video</SelectItem>
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
                      referrerpolicy="strict-origin-when-cross-origin"
                      allowfullscreen
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
                Video Download
              </TabsTrigger>
              <TabsTrigger
                value="mp3"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Music className="w-4 h-4" />
                Audio Download
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mp4" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Video Download Options
                  </CardTitle>
                  <CardDescription>
                    Choose your preferred video quality and format
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">4K</Badge>
                        <div>
                          <p className="font-medium">Ultra HD (2160p)</p>
                        </div>
                      </div>
                      <Button className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">HD</Badge>
                        <div>
                          <p className="font-medium">Full HD (1080p)</p>
                        </div>
                      </div>
                      <Button className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">SD</Badge>
                        <div>
                          <p className="font-medium">Standard (720p)</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">Mobile</Badge>
                        <div>
                          <p className="font-medium">Mobile (480p)</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                            Standard quality • ~7MB
                          </p>
                        </div>
                      </div>
                      <Button 
                      
                        variant="outline"
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <Download className="w-4 h-4" />
                        Download
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
