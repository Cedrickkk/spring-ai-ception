export interface StreamRequestOptions {
  onChunk: (chunk: string) => void;
  signal?: AbortSignal;
}

export async function streamText(
  url: string,
  body: unknown,
  { onChunk, signal }: StreamRequestOptions,
): Promise<string> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/plain" },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok || !response.body) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Request failed (${response.status}): ${errorText || response.statusText}`,
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    full += chunk;
    onChunk(chunk);
  }

  return full;
}
