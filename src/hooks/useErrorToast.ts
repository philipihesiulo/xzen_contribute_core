import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const useErrorToast = () => {
    const { toast } = useToast();

    useEffect(() => {
        const handleError = (error: ErrorEvent) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        };

        window.addEventListener("error", handleError);

        return () => {
            window.removeEventListener("error", handleError);
        };
    }, [toast]);
};