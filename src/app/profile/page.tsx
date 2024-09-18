import { cookies } from 'next/headers';
import { getServerSideUser } from '@/lib/payload-utils';
import ProfilePage from "@/components/Profile";

export default async function Home() {
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);

  return (
    <div>
      {user && <ProfilePage user={user} />}
    </div>
  );
}
