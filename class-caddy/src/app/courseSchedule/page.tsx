import { api, HydrateClient } from "~/trpc/server";
import CourseAdd from "../_components/courseAdd";

export default async function CourseSchedule() {

  return (
    <HydrateClient>
      <main >
        <div>
          <CourseAdd />
        </div>
      </main>
    </HydrateClient>
  );
}