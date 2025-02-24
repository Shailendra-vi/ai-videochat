import { Ollama } from "ollama";

let embeddingsObj: { [key: string]: any } = {};

export async function getEmbeddings(interest: String[]) {
  const ollama = new Ollama();
  const model = "deepseek-r1:latest";

  const interests = interest.sort().join(" ");
  if (!embeddingsObj[interests]) {
    const response = await ollama.embeddings({
      model: model,
      prompt: interests,
    });
    embeddingsObj[interests] = response;
    return response;
  } else {
    return embeddingsObj[interests];
  }
}
