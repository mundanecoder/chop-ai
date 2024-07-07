import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

const sbApiKey = import.meta.env.VITE_SUPABASE_KEY;
const sbUrl = import.meta.env.VITE_SUPABASE_URL;
const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;

const embeddings = new OpenAIEmbeddings({ openAIApiKey });
const client = createClient(sbUrl, sbApiKey);
const vectorStore = new SupabaseVectorStore(embeddings, {
  client,
  tableName: "documents",
  queryName: "match_documents",
});

const retriever = vectorStore.asRetriever();

function combineDocuments(docs: any[]) {
  return docs && docs.map((doc) => doc.pageContent).join("\n\n");
}

function formatConvHistory(messages: string[]) {
  return messages
    .map((message: string, i: number) => {
      if (i % 2 === 0) {
        return `Human: ${message}`;
      } else {
        return `AI: ${message}`;
      }
    })
    .join("\n");
}

export { retriever, formatConvHistory, combineDocuments };
