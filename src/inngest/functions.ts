import prisma from "@/lib/prisma";
import { inngest } from "./client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateIndustryInsights = inngest.createFunction(
   { id: "Generate Industry Insights"},
   { cron: "0 0 * * 0" }, // Run every Sunday at midnight(A cron job is just a scheduled task — something that runs automatically at specific times or intervals.)

  async ({ event, step }) => {
    
    let industries = await step.run("Fetch Industries" , async() => {
      return prisma.industryInsight.findMany();
    })

    for(const {industry} of industries){
       const prompt = `
          Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
          {
            "salaryRanges": [
              { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
            ],
            "growthRate": number,
            "demandLevel": "High" | "Medium" | "Low",
            "topSkills": ["skill1", "skill2"],
            "marketOutlook": "Positive" | "Neutral" | "Negative",
            "keyTrends": ["trend1", "trend2"],
            "recommendedSkills": ["skill1", "skill2"]
          }
          
          IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
          Include at least 5 common roles for salary ranges.
          Growth rate should be a percentage.
          Include at least 5 skills and trends.
        `;

      // All three are used to call AI models but for different purposes:
      // - step.ai.infer() → Offloads AI call to Inngest’s infra to save cost/time (no waiting in your function).
      // - step.ai.wrap() → Wraps your existing AI SDK call to add observability , it tell us logs of our inngest (like how much time function was paused) (logs, tokens, prompts) but here function doesn't get paused.
      // - AgentKit → Used for complex, multi-step AI workflows where multiple tools or agents work together.


      const res = await step.ai.wrap(
        "gemini", // provider
        async (p) => { // fn
          return await model.generateContent(p);
        },
        prompt // prompt
      );

      const text = (res?.response?.candidates?.[0]?.content?.parts?.[0] as any)?.text || "";
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

      const insights = JSON.parse(cleanedText);

      await step.run(`Update Insights for ${industry}` , async() => {
        await prisma.industryInsight.update({
          where : {industry},
          data : {
            ...insights,
            lastUpdated : new Date(),
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          }
        })
      })



    }

    

  },
);