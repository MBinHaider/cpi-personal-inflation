import { useState, useEffect, useRef } from 'react';
import { RotateCcw, Pencil, Share2 } from 'lucide-react';

interface Props {
  retakeLabel: string;
  editLabel: string;
  shareLabel: string;
  copiedLabel: string;
  onRetake: () => void;
  onEdit: () => void;
  shareTitle: string;
  shareText: string;
  shareUrl: string;
}

export function ActionRow({ retakeLabel, editLabel, shareLabel, copiedLabel, onRetake, onEdit, shareTitle, shareText, shareUrl }: Props) {
  const [showCopied, setShowCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
  }, []);

  const handleShare = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      return;
    }
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    setShowCopied(true);
    timerRef.current = setTimeout(() => { setShowCopied(false); timerRef.current = null; }, 2500);
  };

  return (
    <div className="flex flex-col items-center gap-1.5 mt-6">
      <div className="flex gap-2 justify-center flex-wrap">
        <button onClick={onRetake} className="text-[11px] px-3 py-2 border border-gray-200 bg-white rounded-lg inline-flex items-center gap-1.5 hover:border-[#0066cc] hover:text-[#0066cc]">
          <RotateCcw className="w-3 h-3" /> {retakeLabel}
        </button>
        <button onClick={onEdit} className="text-[11px] px-3 py-2 border border-gray-200 bg-white rounded-lg inline-flex items-center gap-1.5 hover:border-[#0066cc] hover:text-[#0066cc]">
          <Pencil className="w-3 h-3" /> {editLabel}
        </button>
        <button onClick={handleShare} className="text-[11px] px-3 py-2 bg-[#0066cc] text-white border border-[#0066cc] rounded-lg inline-flex items-center gap-1.5 hover:bg-[#0052a3]">
          <Share2 className="w-3 h-3" /> {shareLabel}
        </button>
      </div>
      {showCopied && (
        <span className="text-[10px] text-green-600 transition-opacity duration-200 ease-out">
          {copiedLabel}
        </span>
      )}
    </div>
  );
}
