# vendor/piper

Dateien für die Sprachausgabe im Browser (offline):

- `ort.wasm.min.js`, `ort-wasm-simd.wasm` – ONNX Runtime Web 1.18.0 (MIT, Microsoft), npm `onnxruntime-web`
- `piper-phonemize.js`, `piper_phonemize.wasm`, `piper_phonemize.data` – eSpeak-NG-Phonemizer von Piper
  (npm `@diffusionstudio/piper-wasm` 1.0.0 bzw. `@mintplex-labs/piper-tts-web` 1.0.5, MIT; enthält eSpeak NG, GPL-3.0)

Die Stimmen (`.onnx`) liegen nicht hier, sondern werden zur Laufzeit von
https://huggingface.co/rhasspy/piper-voices geladen und im Browser-Cache gespeichert.
