import z from "zod/v3";

export const onBoardingSchema = z.object({
    industry : z.string({
        required_error: "Industry is required"
    }),

    subIndustry : z.string({
        required_error: "Sub Industry is required"
    }),

    bio : z.string().max(500).optional(),

    experience : z.string()
    .transform((val) => parseInt(val))
    .pipe(
        z.number()
        .min(0, "Experience must be at least 0 years")
        .max(50, "Experience must be at most 50 years")
    ).optional(),

    skills : z.string()
    .transform((val) => 
        val ? val.split(",").map((skill) => skill.trim()).filter((skill) => skill.length > 0) : []
    ).optional()
})