import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {
    const session = await auth();
    if (!session) redirect('/login');

    return (
        <div className="">
            THIS IS WHERE YOU CREATE A NEW LISTING
        </div>
    )
};

export default Page

