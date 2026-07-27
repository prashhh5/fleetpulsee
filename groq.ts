import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface DigestInput {
  date: string;
  totalTrips: number;
  delayedTrips: number;
  onTimeRate: number;
  tripSummaries: string[];
}

// Model current as of July 2026. Groq retires models with a few weeks'
// notice; if this call starts failing, check console.groq.com/docs/models
// for the current recommended general-purpose model and swap it in here.
const DIGEST_MODEL = "openai/gpt-oss-120b";

export async function generateDigestSummary(input: DigestInput): Promise<string> {
  const prompt = `You are an ops analyst writing a short daily fleet summary for a dispatcher starting their shift.

Date: ${input.date}
Total trips: ${input.totalTrips}
Delayed trips: ${input.delayedTrips}
On-time rate so far: ${Math.round(input.onTimeRate * 100)}%

Trip details:
${input.tripSummaries.map((line) => `- ${line}`).join("\n")}

Write a 3 to 4 sentence summary for someone about to start their shift. Plain language, no headers, no bullet points. Mention anything that needs attention first.`;

  const completion = await groq.chat.completions.create({
    model: DIGEST_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.4,
    max_tokens: 300,
  });

  return (
    completion.choices[0]?.message?.content?.trim() ??
    "Summary unavailable, the model returned an empty response."
  );
}
