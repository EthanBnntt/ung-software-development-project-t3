import { CreateCommunityForm } from '~/app/_components/createCommunityForm';
import { getServerAuthSession } from '~/server/auth';

export default async function CreateCommunityPage() {
    const session = await getServerAuthSession();

    console.log(session)

    if (!session?.user?.id) {
        return <div>Not logged in</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-3xl mb-4">Creating Community:</h1>
            <CreateCommunityForm />
        </div>
    )
}