"use client";

import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const WithAuthComponent = (props: P) => {
        //const { user, isLoading } = useAuth();
        const { authUser: user, isLoading } = useUserStore();

        const router = useRouter();

        useEffect(() => {
            if (!user) {
                router.push("/");
            }
        }, [user, isLoading, router]);

        if (isLoading) {
            return <div>Loading...</div>; // Or a spinner component
        }

        return user ? <WrappedComponent {...props} /> : null;
    };

    // Set a display name for the HOC for better debugging
    WithAuthComponent.displayName = `withAuth(${
        WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;

    return WithAuthComponent;
};

export default withAuth;
