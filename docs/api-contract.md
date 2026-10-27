# API contract — Ollama Cloud milestone

## GET /api/health

Process health only: HTTP 200, `{"status":"ok"}`. This does not assert cloud connectivity, model access or available credits.

## POST /api/analyze

Send multipart/form-data with exactly one file field named `image`. JPEG, PNG and WebP are accepted after content sniffing; filename and browser MIME headers are not trusted. The inclusive image limit is 5 MiB; total multipart body limit is 5 MiB + 64 KiB. Processing stays in bounded memory; no temporary image files are written. Signature validation does not fully decode images.

### Success — HTTP 200

All fields below are required. Types are synchronized in Go and TypeScript.

```json
{
  "status": "analyzed",
  "dishName": "Likely vegetable rice",
  "identificationConfidence": "medium",
  "visibleIngredients": ["rice", "peas"],
  "nutritionEstimate": {
    "servingAssumption": "One medium bowl",
    "caloriesKcal": {"min": 200, "max": 500},
    "proteinGrams": null,
    "carbohydrateGrams": {"min": 40, "max": 80},
    "fatGrams": null,
    "confidence": "low"
  },
  "preparationIdea": ["Cook rice with vegetables."],
  "uncertainties": ["Oil, hidden ingredients and serving size cannot be established from the photo."],
  "disclaimer": "Nutrition is a rough visual estimate, not a measured value. FoodLens is educational, not medical or dietetic advice."
}
```

This example is illustrative test data, not observed model output or nutrition facts.

- `status`: `analyzed | notFoodOrUnclear`.
- Confidence values: `low | medium | high`.
- All strings are nonempty where applicable, at most 1000 Unicode characters.
- `visibleIngredients`: up to 30 likely visible ingredients; uncertain inferences must be labelled. Empty is allowed when ingredients cannot be identified.
- `nutritionEstimate`: required object for analyzed food. Each of its four nutrient fields is required and either null (unknown) or finite non-negative `{min,max}` with `min <= max`. Serving assumption and confidence are required.
- `preparationIdea`: 1–5 concise steps for analyzed food.
- `uncertainties`: 1–10 nonempty strings, including relevant hidden-ingredient and portion limitations.
- `disclaimer`: always replaced with the server-owned educational disclaimer above.

For `notFoodOrUnclear`, all result fields remain present: use an explanatory `dishName`, low identification confidence, empty ingredients/preparation arrays, `nutritionEstimate: null`, uncertainties requesting a clearer food photo, and the disclaimer. Do not invent food, nutrition or preparation advice.

The backend rejects missing/unknown fields, trailing JSON, invalid ranges/confidences and excessive strings/arrays. Extracted model JSON is limited to 32 KiB; the cloud response envelope to 256 KiB. Prompted JSON is used because Ollama Cloud currently documents structured-output enforcement as unsupported. No automatic repair calls or retries are made.

### Errors

```json
{"error":{"code":"INVALID_IMAGE","message":"Choose a supported food image."}}
```

| Condition | Status / code |
|---|---|
| Missing, empty, malformed or extra upload parts | 400 BAD_REQUEST or INVALID_IMAGE |
| Oversized file/request | 413 IMAGE_TOO_LARGE |
| Unsupported content | 415 UNSUPPORTED_MEDIA_TYPE |
| Default model absent or missing vision/completion capabilities | 503 AI_MODEL_UNAVAILABLE |
| Provider authentication, invalid/unavailable model, network/service failures | 503 AI_UNAVAILABLE |
| Provider 402/payment/quota or 429/rate limit | 429 RATE_LIMITED |
| Provider deadline or upstream 408/504 | 504 AI_TIMEOUT |
| Malformed/incomplete/oversized provider output or invalid analysis | 502 AI_INVALID_RESPONSE |
| Overall processing timeout | 503 REQUEST_TIMEOUT |
| Wrong HTTP method | 405 METHOD_NOT_ALLOWED, with Allow header |
| Unknown endpoint | 404 NOT_FOUND |

All API responses use application/json and Cache-Control: no-store. Provider errors and credentials are never returned. Client cancellation propagates to the cloud request.

Provider deadline is fixed at 120 seconds, including model discovery; processing deadline is 135 seconds. Server write deadline is 200 seconds and browser request deadline is 210 seconds. Health behaviour is unchanged; there is no separate readiness endpoint.

## Backend setup

Only OLLAMA_API_KEY is configurable, through private backend/.env or an exported backend environment variable. Defaults are fixed in Go. Before inference the backend verifies the default gemma4:31b capability listing; discovery cannot determine whether the account's requests are free. Health remains process-only. Success response fields and frontend types are unchanged by this configuration simplification.

## Response-format reliability follow-up

The parser accepts surrounding whitespace, an optional UTF-8 BOM, or a single complete plain/json Markdown code fence around the entire food object. It does not extract arbitrary JSON from prose, repair malformed JSON, invent missing values or relax nutrition validation. Public error shape and status remain unchanged.

For AI_INVALID_RESPONSE the backend logs controlled rejection metadata: model ID, reason, approved field name where available and response byte count. Reasons distinguish invalid envelope, incomplete response, token truncation, empty content, invalid JSON, missing fields, invalid types/values/ranges and output limits. Raw model content, decoder errors, images and credentials are excluded. This is backend troubleshooting information, not a new frontend API field.

## Single-service static hosting

Go now serves the built frontend at GET/HEAD / and existing asset paths, using only the frontend build directory. Missing assets, directories and hidden/private paths return 404; unsupported static methods return 405. Static responses use their appropriate content type and no-cache; they do not use the JSON error contract. All /api paths, including unknown ones and methods, continue through the existing JSON API handler. API response fields and frontend types are unchanged.

PORT is optional platform-provided infrastructure metadata: valid ports 1–65535 bind 0.0.0.0; without it the local address stays 127.0.0.1:8080. The private .env remains key-only. Process health does not assert frontend asset availability or provider access; container smoke checks verify assets separately.
