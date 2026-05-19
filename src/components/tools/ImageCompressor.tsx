import { useState, useRef } from "react";
import { Minimize2, Upload, Image as ImageIcon, ArrowRight, Download, Trash2 } from "lucide-react";

export default function ImageCompressor() {
  const [image, setImage] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState(75);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadImage(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      loadImage(e.dataTransfer.files[0]);
    }
  };

  const loadImage = (file: File) => {
    // Accept only images
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    setImage(file);
    setOriginalSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setOriginalUrl(url);

      // Get dimensions
      const img = new Image();
      img.onload = () => {
        setDimensions({ width: img.width, height: img.height });
        compressImage(img, file.type);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const compressImage = (img: HTMLImageElement, fileType: string) => {
    setIsCompressing(true);
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      setIsCompressing(false);
      return;
    }

    // Set dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw original image onto canvas
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Standardize file type to jpeg or webp if png isn't required (or allow transparent png, but jpeg is best for file savings)
    // Let's output as image/jpeg unless the quality slider triggers otherwise.
    const formatType = fileType === "image/png" || fileType === "image/webp" ? fileType : "image/jpeg";

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCompressedSize(blob.size);
          if (compressedUrl) {
            URL.revokeObjectURL(compressedUrl);
          }
          setCompressedUrl(URL.createObjectURL(blob));
        }
        setIsCompressing(false);
      },
      formatType,
      quality / 100
    );
  };

  // Re-run compression when quality changes
  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality);
    if (originalUrl && image) {
      const img = new Image();
      img.onload = () => {
        compressImage(img, image.type);
      };
      img.src = originalUrl;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleClear = () => {
    setImage(null);
    setOriginalUrl(null);
    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
    }
    setCompressedUrl(null);
    setOriginalSize(null);
    setCompressedSize(null);
    setDimensions(null);
  };

  // Calculate compression ratio
  const savingsPercentage =
    originalSize && compressedSize ? Math.round(((originalSize - compressedSize) / originalSize) * 100) : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
        <Minimize2 className="w-5 h-5 text-brand-500" /> Image Compressor Workspace
      </h2>

      {!image ? (
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
            accept="image/*"
            className="hidden"
          />
          <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-md border border-slate-100 dark:border-slate-700/50 text-slate-400 group-hover:text-brand-500 group-hover:scale-110 transition-fast mb-4">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
            Drag and drop your image here
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mb-3">
            Supports PNG, JPG, JPEG, and WebP formats. 100% client-side.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-fast cursor-pointer shadow-sm"
          >
            Browse Files
          </button>
        </div>
      ) : (
        /* Compressor Workspace */
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 p-4 rounded-xl">
            <div className="text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Original</div>
              <div className="text-base font-semibold font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                {originalSize ? formatSize(originalSize) : "-"}
              </div>
            </div>
            <div className="text-center border-x border-slate-200 dark:border-slate-700/50">
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Compressed</div>
              <div className="text-base font-semibold font-mono text-brand-500 mt-0.5">
                {isCompressing ? "..." : compressedSize ? formatSize(compressedSize) : "-"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-medium">Saved Space</div>
              <div className={`text-base font-semibold font-mono mt-0.5 ${savingsPercentage > 0 ? "text-green-500" : "text-slate-400"}`}>
                {isCompressing ? "..." : savingsPercentage > 0 ? `${savingsPercentage}%` : "0%"}
              </div>
            </div>
          </div>

          {/* Control Quality Slider */}
          <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/60 p-5 rounded-xl space-y-4">
            <div className="flex justify-between text-sm font-semibold text-slate-700 dark:text-slate-300">
              <span>Compression Quality:</span>
              <span className="font-mono text-brand-500">{quality}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => handleQualityChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Max Compression (10% quality)</span>
              <span>High Quality (100% quality)</span>
            </div>
          </div>

          {/* Preview Side by Side */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Original Image Preview
              </h4>
              <div className="border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800 rounded-xl h-56 overflow-hidden flex items-center justify-center p-2 relative group">
                {originalUrl && (
                  <img
                    src={originalUrl}
                    alt="Original preview"
                    className="max-w-full max-h-full object-contain rounded"
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
                <ArrowRight className="w-3.5 h-3.5 text-brand-500" /> Compressed Image Preview
              </h4>
              <div className="border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800 rounded-xl h-56 overflow-hidden flex items-center justify-center p-2 relative">
                {isCompressing ? (
                  <div className="flex flex-col items-center gap-2 text-slate-400 text-sm font-mono animate-pulse">
                    <Minimize2 className="w-6 h-6 animate-spin text-brand-500" />
                    Optimizing...
                  </div>
                ) : compressedUrl ? (
                  <img
                    src={compressedUrl}
                    alt="Compressed preview"
                    className="max-w-full max-h-full object-contain rounded"
                  />
                ) : (
                  <div className="text-slate-400 text-xs italic">Generating compressed image...</div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleClear}
              className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 text-slate-600 dark:text-slate-300 hover:text-red-500 hover:border-red-200 dark:hover:border-red-950/30 rounded-xl transition-fast shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Clear Image
            </button>
            {compressedUrl && !isCompressing && (
              <a
                href={compressedUrl}
                download={`compressed_${image.name}`}
                className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-fast flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Download Optimized Image
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
