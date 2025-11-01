"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { is } from "date-fns/locale";
import { generateAIInsights } from "./dashboard";

// Data parameter Todo
export async function UpdateOnboardingData(data : any) {
    let {userId} = await auth();
    if(!userId) throw new Error("Not authenticated");

    const user = await prisma.user.findUnique({
        where : {clerkUserId : userId},
    })

    if(!user) throw new Error("User not found");

    try{
        // Check if industry is already present or not
        let currIndustry = await prisma.industryInsight.findUnique({
            where : {industry : data.industry},
        })
        
        let industryInsight;

        if(!currIndustry){
            // Create industry insight of this industry
            let insights = await generateAIInsights(data.industry);
            industryInsight = await prisma.industryInsight.create({
                data : {
                    industry : data.industry,
                    ...insights,
                    nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                }
            })
        }

        const updatedUser = await prisma.user.update({
            where : {clerkUserId : userId},
            data : {
                industry : data.industry,
                experience : data.experience,
                bio : data.bio,
                skills : data.skills,
            }
        })

        return {success : true , updatedUser , industryInsight};

    }
    catch(e){
        console.log("Failed to update the onboarding data" , e);
        throw new Error("Failed to update the onboarding data" + e);
    }

}

export async function getUserOnboardingStatus() {
    let {userId} = await auth();
    if(!userId) throw new Error("Not authenticated");

    const user = await prisma.user.findUnique({
        where : {clerkUserId : userId},
    })

    if(!user) throw new Error("User not found");

    try{
        let user = await prisma.user.findUnique({
            where : {clerkUserId : userId},
            select : {
                industry : true,
            }
        })

        return {
            isOnboarded : user?.industry ? true : false,
        }
    }   
    catch(e){
        console.log("Failed to fetch the onboarding status" , e);
        throw new Error("Failed to fetch the onboarding status");
    }
} 