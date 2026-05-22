import { useEffect, useRef } from "preact/hooks";
import { useComputed } from "@preact/signals";
import { t } from "../../stores/lang";

interface CorruptionOverlayProps {
  ip: string;
  onComplete: () => void;
}

export default function CorruptionOverlay({
  ip,
  onComplete,
}: CorruptionOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const trans = useComputed(() => t());

  useEffect(() => {
    // Activate overlay with animation frame delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlayRef.current?.classList.add("corruption-overlay--active");
      });
    });

    let count = 10;
    const interval = setInterval(() => {
      count--;
      if (countdownRef.current) {
        countdownRef.current.textContent = String(count);
        if (count <= 3) {
          countdownRef.current.classList.add("corruption__countdown--critical");
        }
      }
      if (count <= 0) {
        clearInterval(interval);
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  const tr = trans.value;

  return (
    <div class="corruption-overlay" ref={overlayRef}>
      <div class="corruption__glitch" aria-hidden="true" />
      <div class="corruption__content">
        <h1 class="corruption__title">{tr.corruptTitle}</h1>
        <p class="corruption__warning">{tr.corruptWarning}</p>
        <p class="corruption__ip">{tr.corruptSubtitle.replace("{ip}", ip)}</p>
        <div class="corruption__countdown" ref={countdownRef}>
          10
        </div>
      </div>
    </div>
  );
}
