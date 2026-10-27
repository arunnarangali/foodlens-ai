package validation

import (
	"errors"
	"io"
	"mime"
	"net/http"
)

const MaxImageBytes = 5 * 1024 * 1024
const MaxRequestBytes = MaxImageBytes + 64*1024

type Error struct {
	Status        int
	Code, Message string
}

func (e *Error) Error() string      { return e.Message }
func invalid(message string) *Error { return &Error{400, "INVALID_IMAGE", message} }
func readError(err error) *Error {
	var limit *http.MaxBytesError
	if errors.As(err, &limit) {
		return &Error{413, "IMAGE_TOO_LARGE", "Choose an image no larger than 5 MiB."}
	}
	return invalid("The multipart upload is incomplete or malformed.")
}

// Read consumes a bounded multipart stream entirely in memory; it never creates temporary files.
func Read(w http.ResponseWriter, r *http.Request) ([]byte, *Error) {
	r.Body = http.MaxBytesReader(w, r.Body, MaxRequestBytes)
	defer r.Body.Close()
	media, _, err := mime.ParseMediaType(r.Header.Get("Content-Type"))
	if err != nil || media != "multipart/form-data" {
		return nil, &Error{400, "BAD_REQUEST", "Send multipart/form-data with one image field."}
	}
	reader, err := r.MultipartReader()
	if err != nil {
		return nil, invalid("Invalid multipart boundary.")
	}
	var data []byte
	found := false
	for {
		part, err := reader.NextPart()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, readError(err)
		}
		if found || part.FormName() != "image" || part.FileName() == "" {
			return nil, invalid("Send exactly one file in the image field.")
		}
		found = true
		data, err = io.ReadAll(io.LimitReader(part, MaxImageBytes+1))
		if err != nil {
			return nil, readError(err)
		}
		if len(data) > MaxImageBytes {
			return nil, &Error{413, "IMAGE_TOO_LARGE", "Choose an image no larger than 5 MiB."}
		}
		if len(data) == 0 {
			return nil, invalid("The selected image is empty.")
		}
		detected := http.DetectContentType(data)
		if detected != "image/jpeg" && detected != "image/png" && detected != "image/webp" {
			return nil, &Error{415, "UNSUPPORTED_MEDIA_TYPE", "Choose a JPEG, PNG, or WebP image."}
		}
	}
	if !found {
		return nil, invalid("Choose an image to upload.")
	}
	return data, nil
}
