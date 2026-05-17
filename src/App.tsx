import { useState, useRef, useCallback } from "react";
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Palette, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCcw,
  ArrowRight,
  Info,
  Droplets,
  Sun,
  Contrast,
  Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnalysisData } from "./types";
import { cn } from "@/lib/utils";

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const analyzeImage = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text flex flex-col">
      {/* Header Section */}
      <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-natural-border shrink-0">
        <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
          <div className="w-8 h-8 bg-primary rounded-full"></div>
          <h1 className="text-xl font-bold tracking-tight text-primary">
            HUE HARMONY <span className="font-normal text-sm ml-2 text-natural-muted hidden sm:inline">Professional Color Analysis</span>
          </h1>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-natural-muted">
          <span className="text-primary border-b-2 border-primary pb-0.5 cursor-pointer">Analysis</span>
          <span className="hover:text-primary transition-colors cursor-pointer">About</span>
          <span className="hover:text-primary transition-colors cursor-pointer">Guide</span>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        {!result ? (
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto space-y-8 py-10">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">당신의 진정한 컬러를 <br />발견해보세요</h2>
              <p className="text-natural-muted text-lg max-w-md mx-auto">AI 전문가가 당신의 사진을 분석하여 최고의 퍼스널 컬러 팔레트를 제안합니다.</p>
            </div>

            <div 
              className={cn(
                "w-full aspect-[4/3] max-h-[400px] natural-card border-dashed border-2 flex flex-col items-center justify-center relative transition-all duration-300 shadow-none",
                image ? "border-primary/20" : "border-natural-border hover:border-primary/50"
              )}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {image ? (
                <div className="w-full h-full relative group">
                  <img src={image} className="w-full h-full object-cover" alt="Preview" />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="mb-4"
                      >
                        <RefreshCcw className="w-10 h-10 text-primary" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-2">분석 진행 중...</h3>
                      <p className="text-natural-muted text-sm italic">"전문가가 분석 결과를 정리하고 있습니다"</p>
                    </div>
                  )}
                  {!isAnalyzing && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="rounded-full">
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        사진 변경
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="flex flex-col items-center gap-4 cursor-pointer p-10"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-20 h-20 bg-natural-accent rounded-full flex items-center justify-center text-natural-muted group-hover:text-primary transition-colors">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-xl mb-1 text-primary">사진을 업로드하세요</p>
                    <p className="text-natural-muted text-sm">드래그 앤 드롭 또는 클릭하여 정면 사진 선택</p>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-natural-muted uppercase tracking-wider">
                      <Sun className="w-3 h-3" /> 자연광
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-natural-muted uppercase tracking-wider">
                      <RefreshCcw className="w-3 h-3" /> 노필터
                    </div>
                  </div>
                </div>
              )}
            </div>

            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />

            {!isAnalyzing && (
              <Button 
                className={cn("w-full py-7 text-lg font-bold rounded-full transition-all", image ? "bg-primary hover:opacity-90 text-white shadow-lg shadow-primary/20" : "bg-neutral-200 text-neutral-400")}
                disabled={!image}
                onClick={analyzeImage}
              >
                무료 분석 시작하기
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Left Column: Summary & Portrait */}
            <section className="w-full lg:w-[320px] flex flex-col gap-4">
              <div className="natural-card p-8 flex flex-col items-center justify-center text-center">
                <div className="w-48 h-64 bg-natural-accent rounded-full overflow-hidden mb-6 relative border-4 border-white shadow-inner">
                  <img src={image || ''} className="w-full h-full object-cover" alt="User" />
                  <div className="absolute bottom-0 w-full bg-secondary py-2 text-white font-bold text-[10px] uppercase tracking-widest">
                    {result.season_type.split(' ')[0]}
                  </div>
                </div>
                <h2 className="text-3xl font-serif font-bold text-primary">{result.season_type}</h2>
                <div className="flex items-center gap-2 mt-1">
                   <Badge variant="outline" className="text-secondary border-secondary bg-secondary/5 font-serif italic text-sm py-0">
                    {result.sub_type}
                   </Badge>
                </div>
                <p className="text-sm text-natural-muted mt-4 italic leading-relaxed">
                  "{result.summary}"
                </p>
                <div className="mt-8 w-full">
                  <div className="flex justify-between text-[10px] uppercase font-bold mb-1.5 px-1 tracking-wider text-natural-muted">
                    <span>Analysis Confidence</span>
                    <span>{(result.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-natural-accent rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-secondary"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-natural-accent rounded-2xl p-5 border border-natural-border text-[12px] leading-relaxed relative">
                <div className="absolute -top-3 left-4 bg-primary text-white px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest">Note</div>
                <p className="mt-1">{result.analysis.overall_impression}</p>
              </div>
              <Button variant="ghost" className="w-full rounded-2xl py-6 border border-natural-border text-natural-muted hover:text-primary hover:bg-white" onClick={reset}>
                <RefreshCcw className="w-4 h-4 mr-2" /> 새 이미지 분석
              </Button>
            </section>

            {/* Middle Column: Detailed Metrics */}
            <section className="flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {/* Skin Tone Analysis */}
                <div className="natural-card p-6 flex flex-col min-h-[280px]">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6 border-b border-natural-border pb-3 flex items-center justify-between">
                    Skin Analysis
                    <Droplets className="w-4 h-4 opacity-30" />
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-medium"><span>Brightness</span><span className="font-bold text-primary">{result.analysis.brightness}</span></div>
                      <div className="flex gap-1.5">
                        <div className={cn("h-1 flex-1 rounded-full", result.analysis.brightness.includes('고') ? "bg-secondary" : "bg-natural-accent")}></div>
                        <div className={cn("h-1 flex-1 rounded-full", result.analysis.brightness.includes('중') ? "bg-secondary" : "bg-natural-accent")}></div>
                        <div className={cn("h-1 flex-1 rounded-full", (result.analysis.brightness.includes('저') || result.analysis.brightness.includes('차분')) ? "bg-secondary" : "bg-natural-accent")}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-medium"><span>Saturation</span><span className="font-bold text-primary">{result.analysis.saturation}</span></div>
                      <div className="flex gap-1.5">
                        <div className={cn("h-1 flex-1 rounded-full", result.analysis.saturation.includes('고') ? "bg-secondary" : "bg-natural-accent")}></div>
                        <div className={cn("h-1 flex-1 rounded-full", result.analysis.saturation.includes('중') ? "bg-secondary" : "bg-natural-accent")}></div>
                        <div className={cn("h-1 flex-1 rounded-full", result.analysis.saturation.includes('저') ? "bg-secondary" : "bg-natural-accent")}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1.5 font-medium"><span>Contrast</span><span className="font-bold text-primary">{result.analysis.contrast}</span></div>
                      <div className="flex gap-1.5">
                        <div className={cn("h-1 flex-1 rounded-full", result.analysis.contrast.includes('고') ? "bg-secondary" : "bg-natural-accent")}></div>
                        <div className={cn("h-1 flex-1 rounded-full", result.analysis.contrast.includes('중') ? "bg-secondary" : "bg-natural-accent")}></div>
                        <div className={cn("h-1 flex-1 rounded-full", result.analysis.contrast.includes('저') ? "bg-secondary" : "bg-natural-accent")}></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-6 text-[12px] text-natural-muted leading-relaxed">
                    <p>{result.analysis.skin_tone}</p>
                  </div>
                </div>

                {/* Impression Analysis */}
                <div className="natural-card p-6 flex flex-col min-h-[280px]">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-6 border-b border-natural-border pb-3 flex items-center justify-between">
                    Impression
                    <Sparkles className="w-4 h-4 opacity-30" />
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-dotted border-natural-border">
                      <span className="text-[11px] font-bold text-natural-muted uppercase">Tone</span>
                      <span className="text-xs font-bold text-primary">{result.tone_direction.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dotted border-natural-border">
                      <span className="text-[11px] font-bold text-natural-muted uppercase">Season</span>
                      <span className="text-xs font-bold text-primary">{result.season_type}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-dotted border-natural-border">
                      <span className="text-[11px] font-bold text-natural-muted uppercase">Sub Type</span>
                      <span className="text-xs font-bold text-primary">{result.sub_type}</span>
                    </div>
                  </div>
                  <div className="mt-auto p-4 bg-natural-accent/50 rounded-2xl border border-natural-border text-[11px] leading-relaxed">
                    <strong className="text-secondary font-bold block mb-1 uppercase tracking-widest text-[9px]">Styling Essence</strong>
                    {result.style_tip}
                  </div>
                </div>

                {/* Recommended Palettes */}
                <div className="md:col-span-2 natural-card p-8">
                  <div className="flex justify-between items-end mb-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Best Color Palette</h3>
                    <span className="text-[10px] font-bold text-natural-muted tracking-widest">TOP 8 HARMONIES</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
                    {result.recommended_colors.slice(0, 8).map((color, idx) => (
                      <div key={idx} className="space-y-2 group">
                        <div 
                          className="h-14 sm:h-20 rounded-xl shadow-sm border border-black/5 group-hover:scale-105 transition-transform duration-300" 
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <div className="text-[9px] font-bold text-center truncate px-1 text-natural-muted opacity-80 group-hover:opacity-100">{color.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Right Column: Beauty Tips */}
            <section className="w-full lg:w-[280px] flex flex-col gap-4">
              <div className="bg-primary text-white rounded-xl-plus p-8 shadow-xl shadow-primary/10 flex-1 relative overflow-hidden flex flex-col">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-white/60">Beauty Guide</h3>
                
                <div className="space-y-8 flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white font-bold text-[10px] border border-white/20">L</div>
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black tracking-widest text-secondary uppercase">LIP & CHEEK</h4>
                      <p className="text-[12px] font-medium leading-relaxed opacity-90">{result.makeup_recommendations.lip[0]}, {result.makeup_recommendations.blush[0]} 계열</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white font-bold text-[10px] border border-white/20">H</div>
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black tracking-widest text-secondary uppercase">HAIR COLOR</h4>
                      <p className="text-[12px] font-medium leading-relaxed opacity-90 truncate max-w-[150px]">{result.hair_recommendations[0]}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white font-bold text-[10px] border border-white/20">F</div>
                    <div className="space-y-1">
                      <h4 className="text-[10px] font-black tracking-widest text-secondary uppercase">FASHION</h4>
                      <p className="text-[12px] font-medium leading-relaxed opacity-90">{result.fashion_recommendations[0]}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-5 bg-white/5 rounded-3xl border border-white/10">
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-4 text-secondary">Avoid Palette</h4>
                  <div className="flex gap-2.5 mb-3">
                    {result.avoid_colors.slice(0, 3).map((color, i) => (
                      <div 
                        key={i} 
                        className="w-7 h-7 rounded bg-black/20" 
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      ></div>
                    ))}
                  </div>
                  <p className="text-[10px] leading-snug opacity-70 italic">블랙이나 지나치게 탁한 색은 안색이 어두워 보일 수 있습니다.</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="h-14 bg-white border-t border-natural-border px-8 flex items-center justify-center text-[10px] text-natural-muted italic text-center shrink-0">
        {result?.disclaimer || "사진 기반 분석은 참고용으로만 사용해 주세요."}
      </footer>
    </div>
  );
}


