"""Machine-translate the UI dictionary into the scheduled languages.

Reads  src/lib/locales/base.json   (hand-written en / hi / bn)
       src/lib/locales/langs.json  (languages; `it2` = IndicTrans2 code)
Writes src/lib/locales/mt/<id>.json

Model: AI4Bharat IndicTrans2 distilled 200M (MIT), runs on CPU. The checkpoint is
gated on Hugging Face: accept the terms on the model page, then
`huggingface-cli login` or export HF_TOKEN before running.

    pip install torch transformers sentencepiece IndicTransToolkit
    python scripts/translate-ui.py            # only new / changed strings
    python scripts/translate-ui.py --all      # retranslate everything
    python scripts/translate-ui.py --only ta  # one language
"""

import argparse
import json
import unicodedata
from pathlib import Path

import torch
from IndicTransToolkit.processor import IndicProcessor
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer

MODEL = "ai4bharat/indictrans2-en-indic-dist-200M"
# Pinned: the checkpoint ships its own Python (trust_remote_code), so never float to new code.
REVISION = "173b94239f7c38886b2747b8d4a5db771a7e1232"
ROOT = Path(__file__).resolve().parent.parent / "src/lib/locales"
BATCH = 16

# Unicode script-name prefix expected for each IndicTrans2 script code.
SCRIPT = {"Beng": "BENGALI", "Deva": "DEVANAGARI", "Gujr": "GUJARATI", "Knda": "KANNADA", "Arab": "ARABIC",
          "Mlym": "MALAYALAM", "Mtei": "MEETEI", "Orya": "ORIYA", "Guru": "GURMUKHI", "Olck": "OL", "Taml": "TAMIL",
          "Telu": "TELUGU"}


def clean_script(text, it2):
    """Low-resource outputs sometimes borrow words from another script (seen in Santali).
    Reject those so the UI falls back to English instead of showing mixed scripts."""
    want = SCRIPT[it2.split("_")[1]]
    for ch in text:
        if ch.isalpha() and ord(ch) > 0x24F:
            name = unicodedata.name(ch, "")
            if not (name.startswith(want) or name.startswith("MODIFIER")):
                return False
    return True


def load(path, default):
    return json.loads(path.read_text("utf-8")) if path.exists() else default


def save(path, data):
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2, sort_keys=True) + "\n", "utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true", help="ignore the cache and retranslate every string")
    ap.add_argument("--only", nargs="*", help="language ids to process, e.g. ta te")
    args = ap.parse_args()

    base = load(ROOT / "base.json", {})
    english = {k: v["en"] for k, v in base.items()}
    langs = [l for l in load(ROOT / "langs.json", []) if l.get("mt") and (not args.only or l["id"] in args.only)]

    # English source each translation was made from, so edits trigger a retranslation.
    source_path = ROOT / "mt/_source.json"
    source = load(source_path, {})

    tokenizer = AutoTokenizer.from_pretrained(MODEL, revision=REVISION, trust_remote_code=True)
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL, revision=REVISION, trust_remote_code=True).eval()
    ip = IndicProcessor(inference=True)

    for lang in langs:
        out_path = ROOT / f"mt/{lang['id']}.json"
        done = {} if args.all else load(out_path, {})
        made_from = source.get(lang["id"], {})
        todo = [k for k in english if args.all or k not in done or made_from.get(k) != english[k]]
        done = {k: v for k, v in done.items() if k in english}  # drop removed keys
        print(f"{lang['id']:>4} {lang['label']:<10} {len(todo)} to translate", flush=True)

        for i in range(0, len(todo), BATCH):
            keys = todo[i : i + BATCH]
            batch = ip.preprocess_batch([english[k] for k in keys], src_lang="eng_Latn", tgt_lang=lang["it2"])
            inputs = tokenizer(batch, truncation=True, padding="longest", return_tensors="pt", return_attention_mask=True)
            with torch.no_grad():
                # Cap output relative to input: low-resource targets can otherwise loop to the limit.
                cap = min(256, inputs["input_ids"].shape[1] * 3 + 16)
                out = model.generate(**inputs, use_cache=False, min_length=0, max_length=cap, num_beams=5)
            decoded = tokenizer.batch_decode(out, skip_special_tokens=True, clean_up_tokenization_spaces=True)
            for k, text in zip(keys, ip.postprocess_batch(decoded, lang=lang["it2"])):
                done[k] = text.strip()

        rejected = [k for k, v in done.items() if not clean_script(v, lang["it2"])]
        for k in rejected:
            del done[k]
        if rejected:
            print(f"     dropped {len(rejected)} mixed-script: {', '.join(rejected)}", flush=True)
        save(out_path, done)
        source = load(source_path, {})  # re-read: parallel runs (--only) share this file
        source[lang["id"]] = english
        save(source_path, source)


if __name__ == "__main__":
    main()
