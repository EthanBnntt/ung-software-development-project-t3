import { HydrateClient } from "~/trpc/server";

import { ViewTrendingBooks } from "~/app/_components/viewTrendingBooks";
import { ViewNewBooks } from "~/app/_components/viewNewBooks";

export default async function Home() {
  // TODO: View saved posts
  // TODO: View threads

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col">
        <ViewTrendingBooks />
        <ViewNewBooks />
      </main>
    </HydrateClient>
  );
}
