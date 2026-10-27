import { useEffect, useRef, useState } from "react";

interface Props {
  disabled: boolean;
  onCapture: (file: File) => void;
  onError: (message: string) => void;
}

export default function CameraCapture({ disabled, onCapture, onError }: Props) {
  const [open, setOpen] = useState(false);
  const [starting, setStarting] = useState(false);
  const [saving, setSaving] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const session = useRef(0);

  function stop() {
    session.current += 1;
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
  }

  useEffect(() => () => stop(), []);

  useEffect(() => {
    if (disabled) {
      stop();
      setOpen(false);
      setStarting(false);
      setSaving(false);
    }
  }, [disabled]);

  function close() {
    stop();
    setOpen(false);
    setStarting(false);
    setSaving(false);
  }

  async function start() {
    if (disabled || starting || open) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      onError(
        "Live camera is unavailable. Use HTTPS or localhost with a supported browser, or choose an existing photo.",
      );
      return;
    }
    const current = ++session.current;
    setOpen(true);
    setStarting(true);
    onError("");
    try {
      const next = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" } },
      });
      if (session.current !== current) {
        next.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = next;
      if (video.current) video.current.srcObject = next;
      setStarting(false);
    } catch (error) {
      if (session.current !== current) return;
      close();
      const name = error instanceof DOMException ? error.name : "";
      onError(
        name === "NotAllowedError"
          ? "Camera permission was denied. Allow camera access in your browser or choose an existing photo."
          : name === "NotFoundError"
            ? "No camera was found. Choose an existing photo instead."
            : "Could not open the camera. Check that it is available or choose an existing photo.",
      );
    }
  }

  function capture() {
    const source = video.current;
    if (!source || !source.videoWidth || !source.videoHeight) {
      onError(
        "The camera is not ready yet. Wait for the live preview and try again.",
      );
      return;
    }
    const current = session.current;
    const canvas = document.createElement("canvas");
    const scale = Math.min(
      1,
      1600 / Math.max(source.videoWidth, source.videoHeight),
    );
    canvas.width = Math.max(1, Math.round(source.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(source.videoHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) {
      onError("Could not capture a photo. Choose an existing photo instead.");
      return;
    }
    setSaving(true);
    try {
      context.drawImage(source, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (session.current !== current) return;
          if (!blob) {
            setSaving(false);
            onError("Could not capture a photo. Please try again.");
            return;
          }
          close();
          onCapture(
            new File([blob], "food-camera.jpg", { type: "image/jpeg" }),
          );
        },
        "image/jpeg",
        0.9,
      );
    } catch {
      setSaving(false);
      onError("Could not capture a photo. Please try again.");
    }
  }

  return (
    <div className="camera-capture">
      {!open ? (
        <button
          type="button"
          className="secondary"
          disabled={disabled}
          onClick={start}
        >
          Take a photo
        </button>
      ) : (
        <section aria-label="Camera capture" aria-busy={starting || saving}>
          <video
            ref={video}
            autoPlay
            muted
            playsInline
            aria-label="Live camera preview"
          />
          {starting && <p role="status">Waiting for camera access…</p>}
          <div className="camera-actions">
            <button
              type="button"
              className="secondary"
              disabled={disabled || starting || saving}
              onClick={capture}
            >
              {saving ? "Capturing…" : "Capture photo"}
            </button>
            <button type="button" className="secondary" onClick={close}>
              Cancel camera
            </button>
          </div>
        </section>
      )}
      <p className="small">
        Camera access needs permission and HTTPS or localhost. Nothing is
        submitted until you choose Analyze photo.
      </p>
    </div>
  );
}
