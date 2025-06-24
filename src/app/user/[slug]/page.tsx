
import Image from "@/components/Image";
import StarRating from "@/components/StarRating";
import { X, UserCircle2, ChevronUp, ChevronDown, MapPin } from "lucide-react";
import Listing from "@/components/Listing";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import Link from "next/link";


type Props = {
    params: {
        slug: string;
    };
}

const UserPage = async ({ params }: Props) => {

    const session = await auth();

    const { slug } = await params;

    const user = await prisma.user.findUnique({
        where: { slug },
    })

    if (!user) notFound();

    const dummyComments = [
        {
            username: 'garageLuvr91',
            rating: 5,
            comment: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro.",
        },
        {
            username: 'thriftqueen88',
            rating: 4,
            comment: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro.",
        },
        {
            username: 'bargainhunter',
            rating: 3.5,
            comment: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro.",
        },
    ];

    return (

        <div className="flex flex-col gap-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row max-w-6xl w-full gap-6">

                <div className="flex-1 min-w-0 flex-col">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4">

                        <div className="my-2 flex flex-col">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-[100px] h-[100px] rounded-full overflow-hidden cursor-pointer"
                                >
                                    {user.image ? (
                                        <Image
                                            src={user.image}
                                            alt="profile picture"
                                            width={100}
                                            height={100}
                                            className="rounded-full w-full h-full object-cover border border-black"
                                        />
                                    ) : (
                                        <UserCircle2
                                            width={100}
                                            height={100}
                                        />
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <h1 className="text-2xl font-bold">{user.name}</h1>
                                    <div className="flex items-center">
                                        <MapPin size={20} className="text-orange-400 mr-2" />
                                        <p className="text-sm text-orange-400">New York, NY</p>
                                    </div>
                                    <p className="text-sm text-gray-400">Joined June 2025</p>
                                </div>

                                {session?.user?.id && session.user.id !== user.id && (
                                    <Link
                                        href={`/messages/${user.slug}`}
                                        className="ml-2 text-gray-400 hover:text-orange-400 transition"
                                        title="Send Direct Message"
                                    >
                                        <MessageCircle className="w-6 h-6" />
                                    </Link>
                                )}
                            </div>

                            <p className="text-sm mt-3 text-gray-300">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum aliquam harum, labore recusandae cupiditate repudiandae voluptas quaerat doloribus earum sequi! Dolorum hic praesentium magni officia repudiandae sapiente atque. Harum, voluptatum?
                            </p>
                        </div>
                    </div>


                    {/* Toggle Item List */}
                    <div
                        className="flex items-center justify-start cursor-pointer select-none"
                    >
                        <h1 className="text-xl font-semibold text-gray-200 my-2">
                            Previous Listings <span>(3)</span>
                        </h1>

                        <ChevronUp size={30} className="mx-2 text-gray-400" />

                    </div>

                    {/* Conditionally render item list */}

                    <div className="overflow-y-auto pr-2 rounded-2xl transition-all duration-300 ease-in-out">
                        <div className="flex flex-col gap-3">
                            <Listing />
                            <Listing />
                            <Listing />
                        </div>
                    </div>

                </div>

                {/* Reviews */}
                <div className="my-5 w-full lg:w-[400px] flex-shrink-0">
                    <div
                        className="flex items-center justify-start cursor-pointer select-none mb-4"
                    >
                        <h1 className="text-xl font-semibold text-gray-200">
                            Reviews Left <span>({dummyComments.length})</span>
                        </h1>
                        <ChevronUp size={30} className="mx-2 text-gray-400" />
                    </div>


                    <div className="space-y-2">
                        {dummyComments.map((review, index) => (
                            <div key={index} className="border border-gray-700 rounded-xl p-4 bg-zinc-900 text-gray-200 shadow space-y-3">
                                <div className="flex flex-col md:flex-row items-start justify-between mb-2 gap-2">
                                    <div className="flex items-center gap-3">
                                        <UserCircle2 className="w-6 h-6 text-gray-400" />
                                        <p className="font-medium">{review.username}</p>
                                    </div>
                                    <StarRating rating={review.rating} />
                                </div>
                                <Image
                                    src="reports/garage_sale6_fxkgb9"
                                    alt="Garage sale house"
                                    width={600}
                                    height={300}
                                    className="rounded-lg object-cover w-full"
                                />
                                <p className="text-sm text-gray-300">{review.comment}</p>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

        </div>
    )
};

export default UserPage
