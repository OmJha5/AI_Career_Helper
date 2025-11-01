import { IndustryInsight, User } from "@/generated/prisma/client";
import { useState } from "react";
import { toast } from "sonner";

interface APIOutputType {
    success : boolean,
    updatedUser : User,
    industryInsight : IndustryInsight
}

const useFetch = (cb : any) => {
  const [data, setData] = useState<undefined | APIOutputType>(undefined);
  const [loading, setLoading] = useState<boolean | undefined>(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args : any) => { // ...args can accept any parameter including none
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } 
    catch (error : Error | any) {
      setError(error);
      toast.error(error.message);
    } 
    finally {
      setLoading(false);
    }
  };

  return { data, loading, fn };
};

export default useFetch;