import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const EditListingPage = async () => {
    const session = await auth();
    if (!session) redirect('/login');

    return (
        <div className="">
            THIS IS WHERE YOU EDIT A LISTING
        </div>
    )
};

export default EditListingPage
