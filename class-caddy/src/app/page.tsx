import {HydrateClient } from "~/trpc/server";
import HomeComponent from "./_components/home";
export default async function Home(){
  return (
    <HydrateClient>
      <main >
        <div>
          <HomeComponent />
        </div>
      </main>
    </HydrateClient>
  );
}
