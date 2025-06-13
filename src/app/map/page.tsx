import Map from "@/components/Map";
import { auth } from '@/lib/auth';

const MapPage = async () => {
  const session = await auth();

  return (
    <Map session={session}/>
  )
};

export default MapPage
