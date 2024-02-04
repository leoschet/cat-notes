import { Heading } from "@radix-ui/themes";

export default function Home() {


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Heading className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">Welcome to Cat!</Heading>
        </main>
    );
}
