"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { is } from "date-fns/locale";

// Data parameter Todo
export async function UpdateOnboardingData(data : any) {
    let {userId} = await auth();
    if(!userId) throw new Error("Not authenticated");

    const user = await prisma.user.findUnique({
        where : {clerkUserId : userId},
    })

    if(!user) throw new Error("User not found");

    try{
        const result = await prisma.$transaction(async(tx) => {

            // Check if industry is already present or not
            let currIndustry = await tx.industryInsight.findUnique({
                where : {industry : data.industry},
            })
            
            let industryInsight;

            if(!currIndustry){
                // Create industry insight of this industry
                industryInsight = await tx.industryInsight.create({
                    data : {
                        industry : data.industry,
                        salaryRanges : [],
                        growthRate : 0,
                        demandLevel : "Medium",
                        topSkills : [],
                        marketOutlook : "Neutral",
                        keyTrends : [],
                        recommendedSkills : [],
                        nextUpdate : new Date(Date.now() + 24 * 7 * 60 * 60 * 1000) // After 1 week updation of the industry insights

                    }
                })
            }

            const updatedUser = await tx.user.update({
                where : {clerkUserId : userId},
                data : {
                    industry : data.industry,
                    experience : data.experience,
                    bio : data.bio,
                    skills : data.skills,
                }
            })

            return {updatedUser , industryInsight};

        } , {timeout : 10000}) // 10 seconds timeout

        return {success : true , ...result};


    }
    catch(e){
        console.log("Failed to update the onboarding data" , e);
        throw new Error("Failed to update the onboarding data");
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