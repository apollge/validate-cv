import { HydrateClient } from "~/trpc/server";
import CVValidationForm from "./_components/cv-validation-form";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="min-h-screen bg-gray-50 py-8">
        <CVValidationForm />
      </main>
    </HydrateClient>
  );
}
