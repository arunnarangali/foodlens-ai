import { useEffect, useState } from "react";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export function validateImage(file: File): string | null {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return "Choose a JPEG, PNG, or WebP image.";
  if (file.size === 0) return "The selected image is empty.";
  if (file.size > MAX_IMAGE_BYTES)
    return "Choose an image no larger than 5 MiB.";
  return null;
}
export default function ImageUploader({
  file,
  disabled,
  onChange,
  onError,
}: {
  file: File | null;
  disabled: boolean;
  onChange: (file: File | null) => void;
  onError: (message: string) => void;
}) {
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return (
    <div className="upload-area">
      {preview ? (
        <>
          <img
            className="preview"
            src={preview}
            alt="Selected food preview"
            onError={() => {
              onChange(null);
              onError(
                "This image could not be previewed. Choose another file.",
              );
            }}
          />
          <p className="filename">{file?.name}</p>
          <button
            className="secondary"
            type="button"
            disabled={disabled}
            onClick={() => onChange(null)}
          >
            Remove image
          </button>
        </>
      ) : (
        <div className="upload-hint">
          <span className="upload-symbol" aria-hidden="true">
            ↥
          </span>
          <h2>A little perspective on your plate</h2>
          <p>Select one photo to get started.</p>
        </div>
      )}
      <label className="file-label" htmlFor="food-photo">
        {file ? "Choose another photo" : "Choose a food photo"}
      </label>
      <input
        id="food-photo"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled}
        aria-describedby="upload-help"
        onChange={(event) => {
          const next = event.target.files?.[0];
          event.target.value = "";
          if (!next) return;
          const error = validateImage(next);
          onChange(error ? null : next);
          onError(error || "");
        }}
      />
      <p id="upload-help" className="small">
        JPEG, PNG or WebP · Up to 5 MiB
      </p>
    </div>
  );
}
