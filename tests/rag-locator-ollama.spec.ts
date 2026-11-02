import { test, expect, Page } from '@playwright/test';

/**
 * RAG-driven locator resolution (local, using Ollama)
 * ---------------------------------------------------
 * R = Retrieval   : scrape live DOM -> chunk -> embed -> find top-K chunks for a plain-English instruction
 * A = Augmented   : put ONLY those chunks into the LLM prompt (grounding)
 * G = Generation  : LLM picks the best selector from the retrieved candidates
 * Then Playwright performs the real action + real assertion (the LLM never decides pass/fail).
 *
 * One-time setup:
 *   ollama pull nomic-embed-text    # embedding model
 *   ollama pull llama3.2            # chat model
 *   ollama serve                    # skip if the Ollama app is already running
 *
 * Run:     npx playwright test rag-locator-ollama.spec.ts --headed
 * (No API key needed. Node 18+ for global fetch.)
 */

const OLLAMA = process.env.OLLAMA_URL ?? 'http://localhost:11434';
const EMBED_MODEL = 'nomic-embed-text';
const CHAT_MODEL = 'llama3.2';

type Chunk = { text: string; selector: string; vector?: number[] };

// ---------- 1. INGEST: turn the live page into small, searchable chunks ----------
async function buildChunks(page: Page): Promise<Chunk[]> {
  return page.$$eval('input, button, a, textarea, select, [role="button"]', (els) =>
    els
      .map((el) => {
        const tag = el.tagName.toLowerCase();
        const testId = el.getAttribute('data-testid');
        const id = el.id;
        const placeholder = el.getAttribute('placeholder');
        const aria = el.getAttribute('aria-label');

        // Stable-first selector strategy
        let selector: string | null = null;
        if (testId) selector = `[data-testid="${testId}"]`;
        else if (id) selector = `#${id}`;
        else if (placeholder) selector = `${tag}[placeholder="${placeholder}"]`;
        else if (aria) selector = `${tag}[aria-label="${aria}"]`;
        if (!selector) return null;

        const text = `${tag} | placeholder="${placeholder ?? ''}" | aria="${aria ?? ''}" | text="${(el.textContent ?? '').trim().slice(0, 60)}"`;
        return { text, selector };
      })
      .filter((c): c is { text: string; selector: string } => c !== null)
  );
}

// ---------- 2. EMBED: text -> vector (Ollama /api/embed) ----------
async function embed(texts: string[]): Promise<number[][]> {
  const res = await fetch(`${OLLAMA}/api/embed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: EMBED_MODEL, input: texts }),
  });
  if (!res.ok) throw new Error(`Ollama embed failed (${res.status}): ${await res.text()}`);
  const json = await res.json();
  return json.embeddings;
}

// ---------- 3. RETRIEVE: cosine similarity, top-K ----------
const cosine = (a: number[], b: number[]) => {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] ** 2;
    nb += b[i] ** 2;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
};

async function retrieve(query: string, chunks: Chunk[], k = 3): Promise<Chunk[]> {
  const [qVec] = await embed([query]);
  return [...chunks]
    .sort((x, y) => cosine(qVec, y.vector!) - cosine(qVec, x.vector!))
    .slice(0, k);
}

// ---------- 4. GENERATE: LLM answers using ONLY the retrieved context (Ollama /api/chat) ----------
async function askLLM(instruction: string, context: Chunk[]): Promise<string> {
  const candidates = context.map((c, i) => `${i + 1}. selector: ${c.selector}  <- ${c.text}`).join('\n');

  const res = await fetch(`${OLLAMA}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: CHAT_MODEL,
      stream: false,
      options: { temperature: 0 }, // determinism matters in test automation
      messages: [
        {
          role: 'system',
          content:
            'You pick UI selectors. Choose ONLY from the candidate list. Reply with the selector string and nothing else.',
        },
        { role: 'user', content: `Instruction: ${instruction}\n\nCandidates:\n${candidates}` },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Ollama chat failed (${res.status}): ${await res.text()}`);
  const json = await res.json();

  // Small local models often wrap the answer in quotes/backticks, so strip them
  return json.message.content.trim().replace(/^[`"']+|[`"']+$/g, '');
}

// ---------- Orchestrator ----------
async function resolveLocator(page: Page, instruction: string): Promise<string> {
  const chunks = await buildChunks(page);
  const vectors = await embed(chunks.map((c) => c.text));
  chunks.forEach((c, i) => (c.vector = vectors[i]));

  const top = await retrieve(instruction, chunks);
  const answer = await askLLM(instruction, top);
 //truth - power, AI hallucinates - selectors correct  more confidence
  // GUARDRAIL: reject hallucinated selectors that were not in the retrieved context
  const valid = top.find((c) => c.selector === answer);
  if (!valid) throw new Error(`LLM returned a selector outside retrieved context: ${answer}`);

  console.log(`"${instruction}" -> ${valid.selector}`);
  return valid.selector;
}

// ---------- The actual test ----------
test('RAG (Ollama) resolves the locator, Playwright does the real assertions', async ({ page }) => {
  // Local models can be slow on CPU-only machines
  test.setTimeout(120_000);

  await page.goto('https://demo.playwright.dev/todomvc');

  const inputSelector = await resolveLocator(page, 'the input box where I type a new todo item');

  await page.locator(inputSelector).fill('Prepare for interview');
  await page.locator(inputSelector).press('Enter');

  // Deterministic, non-AI assertion
  await expect(page.getByTestId('todo-title')).toHaveText('Prepare for interview');
});