"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, Music, Play } from "lucide-react";
import ISO6391 from "iso-639-1";
import { langToCountry, gptVoices } from "@/lib/dataSource";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage, setVoice } from "@/lib/redux/slices/settingsSlice";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SettingsPage() {
  const [playingVoice, setPlayingVoice] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const dispatch = useDispatch();
  const { language: selectedLanguage, voice: selectedVoice } = useSelector(
    (state) => state.settings
  );

  const [languageSearch, setLanguageSearch] = useState("");
  const [voiceSearch, setVoiceSearch] = useState("");

  const languagesC = ISO6391.getAllCodes()
    .map((code) => {
      const countryCode = langToCountry[code];
      return {
        value: code,
        label: ISO6391.getName(code),
        flag: countryCode
          ? `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`
          : null,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const filteredLanguages = languagesC
    .filter(
      (lang) =>
        lang.label.toLowerCase().includes(languageSearch.toLowerCase()) ||
        lang.value.toLowerCase().includes(languageSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (a.value === selectedLanguage) return -1;
      if (b.value === selectedLanguage) return 1;
      return a.label.localeCompare(b.label);
    });

  const filteredVoices = gptVoices
    .filter((voice) =>
      voice.name.toLowerCase().includes(voiceSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (a.name === selectedVoice) return -1;
      if (b.name === selectedVoice) return 1;
      return a.name.localeCompare(b.name);
    });

  const handlePlayVoice = async (voiceName) => {
    setPlayingVoice(voiceName);

    const payload = {
      text: "Today is a wonderful day to build something people love!",
      voice: voiceName,
    };

    try {
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch audio");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.play();
      audio.onended = () => {
        setPlayingVoice(null);
      };
    } catch (error) {
      console.error("Error fetching audio:", error);
      toast.error("Failed to load audio. Please try again.");
      setPlayingVoice(null);
    }
  };

  const handleSave = () => {
    dispatch(setLanguage(selectedLanguage));
    dispatch(setVoice(selectedVoice));
    toast.success("Settings Updated");
    console.log("Saving settings:", {
      language: selectedLanguage,
      voice: selectedVoice,
    });
  };

  const handleDelete = async () => {
console.log('deleting....')
    // try {
    //   const response = await fetch("/api/admin/delete-enterprise/3", {
    //     method: "DELETE",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });

    //   if (!response.ok) {
    //     throw new Error("Failed to deactivate account");
    //   }

    //   toast.success("Account deactivated successfully");
    //   setIsDialogOpen(false);
    // } catch (error) {
    //   console.error("Error deactivating account:", error);
    //   toast.error("Failed to deactivate account. Please try again.");
    // }
  };

  return (
    <section className="container mx-auto p-4 space-y-8">

      <Card>
        <CardHeader className={"md:text-center"}>
          <CardTitle>Choose Preferred Language</CardTitle>
          <p className="text-sm text-muted-foreground">
            How would you like to listen?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search languages..."
            value={languageSearch}
            onChange={(e) => setLanguageSearch(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {filteredLanguages.map((lang) => (
              <div
                key={lang.value}
                className={`flex relative border items-center p-2 rounded-md cursor-pointer hover:bg-accent ${
                  selectedLanguage === lang.value
                    ? "bg-accent border-green-600"
                    : ""
                }`}
                onClick={() => dispatch(setLanguage(lang.value))}
              >
                {lang.flag ? (
                  <img
                    src={lang.flag}
                    alt={`${lang.label} flag`}
                    className="w-4 h-3 mr-2"
                    onError={(e) => {
                      console.warn(`Flag not found for ${lang.value}`);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="w-4 h-3 mr-2" />
                )}
                <span>{lang.label}</span>
                {selectedLanguage === lang.value && (
                  <div className=" absolute right-2">
                    <CircleCheck className="text-green-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
          <Button
            className={"bg-blue-600 w-full hover:bg-blue-700 cursor-pointer"}
            onClick={handleSave}
          >
            Save
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Choose Preferred Voice</CardTitle>
          <p className="text-sm text-muted-foreground">
            How would you like to listen?
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search voices..."
            value={voiceSearch}
            onChange={(e) => setVoiceSearch(e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
            {filteredVoices.map((voice) => (
              <div
                key={voice.name}
                className={`flex items-center justify-between p-2 border rounded-md cursor-pointer hover:bg-accent ${
                  selectedVoice === voice.name
                    ? "bg-accent border-green-600"
                    : ""
                }`}
                onClick={() => dispatch(setVoice(voice.name))}
              >
                <div className="flex items-center">
                  <Music className="w-4 h-4 mr-2" />
                  <span>{voice.name}</span>
                </div>
                <Button
                  className={
                    "border rounded-full hover:bg-slate-700 bg-black cursor-pointer"
                  }
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayVoice(voice.name);
                  }}
                >
                  {playingVoice === voice.name ? (
                    <span className="animate-spin">
                      <Play className="w-4 h-4 text-white" />
                    </span>
                  ) : (
                    <Play className="w-4 h-4 text-white" />
                  )}
                </Button>
              </div>
            ))}
          </div>
          <Button
            className={"bg-blue-600 w-full hover:bg-blue-700 cursor-pointer"}
            onClick={handleSave}
          >
            Save
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Deactivate Account</CardTitle>
          <p className="text-sm text-muted-foreground">
            Here you can deactivate your account!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className={"bg-red-600 w-full hover:bg-red-700 cursor-pointer"}
              >
                Deactivate
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Account Deactivation</DialogTitle>
                <DialogDescription>
                  Are you sure you want to deactivate your account? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  className={'cursor-pointer'}
                  onClick={() => setIsDialogOpen(false)}
                >
                  No
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 cursor-pointer" 
                  onClick={handleDelete}
                >
                  Yes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </section>
  );
}