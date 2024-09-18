"use client"
import { useState, PropsWithChildren } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpc } from "@/trpc/client"
import { httpBatchLink } from "@trpc/client"
import { ThemeProvider } from "@/context/themecontext"

const Providers = ({ children }: PropsWithChildren) => {

    const [queryClient] = useState(() => new QueryClient())
    const [trpcClient] = useState(() => trpc.createClient({
        links: [
            httpBatchLink({
                url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,
                fetch(url, options) {
                    return fetch(url, {
                        ...options,
                        credentials: "include",
                    })
                }
            })
        ]
    }))

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                {children}
                </ThemeProvider>
            </QueryClientProvider>
        </trpc.Provider>

    )

}

export default Providers