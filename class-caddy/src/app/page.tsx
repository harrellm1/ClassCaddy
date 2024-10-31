import { api, HydrateClient } from "~/trpc/server";
import Login from "./_components/home";

export default async function Home() {

  return (
    <HydrateClient>
      <main >
        <div>
          <Login />
        </div>
      </main>
    </HydrateClient>
  );
}