import { useState, useRef } from "react";
import { RefreshCw, Upload, Image as ImageIcon, Download, Trash2 } from "lucide-react";

export default function PngToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [isConverting, setIsConverting] = useState(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadFile(e.dataTransfer.files[0]);
    }
  };

  const loadFile = (file: File) => {
    if (file.type !== "image/png") {
      alert("Please select a valid PNG image file.");
      return;
    }

    setFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setOriginalUrl(url);

      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
        convertImage(img, bgColor);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const convertImage = (img: HTMLImageElement, fillBg: string) => {
    setIsConverting(true);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setIsConverting(false);
      return;
    }

    canvas.width = img.width;
    canvas.height = img.height;

    // Fill background first (since JPG does not support transparency)
    ctx.fillStyle = fillBg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw PNG over the background
    ctx.drawImage(img, 0, 0);

    // Convert to JPG blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          if (convertedUrl) {
            URL.revokeObjectURL(convertedUrl);
          }
          setConvertedUrl(URL.createObjectURL(blob));
        }
        setIsConverting(false);
      },
      "image/jpeg",
      0.92 // Quality setting for high-quality output
    );
  };

  const handleBgColorChange = (color: string) => {
    setBgColor(color);
    if (originalUrl && file) {
      const img = new Image();
      img.onload = () => {
        convertImage(img, color);
      };
      img.src = originalUrl;
    }
  };

  const handleClear = () => {
    setFile(null);
    setOriginalUrl(null);
    if (convertedUrl) {
      URL.revokeObjectURL(convertedUrl);
    }
    setConvertedUrl(null);
    setDimensions(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <RefreshCw className="w-5 h-5 text-brand-500" /> PNG to JPG Converter
      </h2>

      {!file ? (
        /* Drop Zone */
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-slate-700/80 hover:border-brand-500 dark:hover:border-brand-500 bg-slate-50 dark:bg-slate-800/20 hover:bg-brand-50/10 dark:hover:bg-brand-950/5 p-12 rounded-2xl text-center cursor-pointer transition-all duration-200 group flex flex-col items-center"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png"
            className="hidden"
          />
          <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-100 dark:border-slate-700/50 text-slate-400 group-hover:text-brand-500 group-hover:scale-110 transition-fast mb-4">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Drag and drop your PNG image here
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-3">
            Accepts PNG files. Perfect for flat images and photos with transparency.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-fast cursor-pointer shadow-sm"
          >
            Choose PNG File
          </button>
        </div>
      ) : (
        /* Converter Workspace */
        <div className="space-y-6">
          {/* Background Options */}
          <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 p-5 rounded-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  Transparency Fill Color
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Since JPG doesn't support transparency, transparent pixels will be filled with this color.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {["#ffffff", "#000000", "#f8fafc", "#f1f5f9", "#e2e8f0"].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleBgColorChange(color)}
                    className={`w-8 h-8 rounded-full border shadow-sm cursor-pointer transition-fast relative flex items-center justify-center ${
                      bgColor === color ? "border-brand-500 ring-2 ring-brand-500/25" : "border-slate-300 dark:border-slate-700"
                    }`}
                    style={{ backgroundColor: color }}
                    title={`Fill background with ${color}`}
                  />
                ))}
                <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => handleBgColorChange(e.target.value)}
                    className="w-8 h-8 p-0 rounded-md border border-slate-350 cursor-pointer"
                    title="Choose custom color"
                  />
                  <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase">
                    {bgColor}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison View */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Original PNG Preview
              </h4>
              <div className="border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800 rounded-xl h-56 overflow-hidden flex items-center justify-center p-2 relative">
                {originalUrl && (
                  <img
                    src={originalUrl}
                    alt="Original PNG preview"
                    className="max-w-full max-h-full object-contain rounded"
                    // Add a checkerboard background pattern for transparency preview
                    style={{
                      backgroundImage: "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                      backgroundSize: "16px 16px",
                      backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px"
                    }}
                  />
                )}
                {dimensions && (
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    {dimensions.width} × {dimensions.height} px
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-brand-500" /> Converted JPG Preview
              </h4>
              <div className="border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800 rounded-xl h-56 overflow-hidden flex items-center justify-center p-2 relative">
                {isConverting ? (
                  <div className="flex flex-col items-center gap-2 text-slate-400 text-sm font-mono animate-pulse">
                    <RefreshCw className="w-6 h-6 animate-spin text-brand-500" />
                    Converting...
                  </div>
                ) : convertedUrl ? (
                  <img
                    src={convertedUrl}
                    alt="Converted JPG preview"
                    className="max-w-full max-h-full object-contain rounded"
                  />
                ) : (
                  <div className="text-slate-400 text-xs italic">Converting to JPG...</div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleClear}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-300 hover:text-red-500 hover:border-red-255 dark:hover:border-red-950/30 rounded-xl transition-fast shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Clear Image
            </button>
            {convertedUrl && !isConverting && (
              <a
                href={convertedUrl}
                download={`${file.name.substring(0, file.name.lastIndexOf(".")) || file.name}.jpg`}
                className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-fast flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Converted JPG
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
