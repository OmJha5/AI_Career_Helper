import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function CheckUser() {
    const user = await currentUser();

    if(!user) return null;

    try{
      const loggedInUser = await prisma.user.findUnique({
        where : {
          clerkUserId : user.id
        }
      })

      if(loggedInUser) return loggedInUser;

      const name = `${user.firstName} ${user.lastName || ''}`;

      const newUser = await prisma.user.create({
        data : {
          clerkUserId : user.id,
          name,
          imageUrl : user.imageUrl || "",
          email : user.emailAddresses[0].emailAddress
        }
      })

      return newUser;

    }
    catch(e){
      console.log(e);
    }

}
