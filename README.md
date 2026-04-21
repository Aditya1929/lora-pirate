# LLaMA 3 8B × Captain Jack Sparrow — LoRA Fine-Tune

Fine-tunes LLaMA 3 8B via QLoRA to speak like Captain Jack Sparrow. Hosted on Modal.

## Stack

- **Base model:** `meta-llama/Meta-Llama-3-8B-Instruct`
- **Fine-tuning:** LoRA (r=16, target: attention layers) + 4-bit quantization via `bitsandbytes`
- **Training:** Hugging Face `trl` SFTTrainer
- **Serving:** Modal (A100 serverless GPU)

## Dataset

JSONL instruction-response pairs written in Jack Sparrow's voice, sourced from film transcripts and hand-authored examples.

```json
{"instruction": "What's your plan?", "response": #Lot of arrs}
```

## Training

```python
lora_config = LoraConfig(r=16, lora_alpha=32, target_modules=["q_proj", "v_proj", "k_proj", "o_proj"], task_type="CAUSAL_LM")

trainer = SFTTrainer(
    model=model,          # loaded in 4-bit via BitsAndBytesConfig
    train_dataset=dataset,
    peft_config=lora_config,
    args=SFTConfig(num_train_epochs=3, learning_rate=2e-4, bf16=True)
)
trainer.train()
```

---

## Modal Deployment

```python
@app.cls(gpu="A100", image=image, container_idle_timeout=300)
class JackSparrowModel:
    @modal.enter()
    def load(self):
        self.model = PeftModel.from_pretrained(base_model, "path/to/adapter")

    @modal.method()
    def generate(self, prompt: str) -> str:
        inputs = self.tokenizer(prompt, return_tensors="pt").to("cuda")
        output = self.model.generate(**inputs, max_new_tokens=256, temperature=0.9, do_sample=True)
        return self.tokenizer.decode(output[0], skip_special_tokens=True)
```

```bash
modal deploy modal_serve.py
```

## Requirements

- Hugging Face account with LLaMA 3 access
- Modal account (`pip install modal && modal setup`)
- 24GB+ VRAM for training (Modal handles inference)
