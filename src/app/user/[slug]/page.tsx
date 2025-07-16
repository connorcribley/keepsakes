
import ClickableImage from "@/components/ClickableImage";
import StarRating from "@/components/StarRating";
import { UserCircle2, ChevronUp, MapPin, MoreHorizontal } from "lucide-react";
import Listing from "@/components/Listing";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProfileMenuButton from "@/components/profile/ProfileMenuButton";
import EditProfileModal from "@/components/profile/EditProfileModal";
import BlockedInfoContainer from "@/components/profile/BlockedInfoContainer";
import ProfileBlockProvider from "@/context/ProfileBlockContext";

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
        select: {
            id: true,
            name: true,
            slug: true,
            image: true,
            location: true,
            createdAt: true,
            bio: true,
        },
    });

    if (!user) notFound();

    const isOwnProfile = session?.user?.id === user.id;


    const isBlocked = isOwnProfile ? null : await prisma.userBlock.findFirst({
        where: {
            OR: [
                { blockerId: session?.user?.id, blockedId: user.id },
                { blockerId: user.id, blockedId: session?.user?.id },
            ],
        },
    });


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

        <ProfileBlockProvider
            initialIsBlocked={!isOwnProfile && !!isBlocked && isBlocked.blockedId === session?.user?.id}
            initialHasBlocked={!isOwnProfile && !!isBlocked && isBlocked.blockerId === session?.user?.id}
        >
            <div className="flex flex-col gap-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col lg:flex-row max-w-6xl w-full gap-6">
                    <div className="flex-1 min-w-0 flex-col">
                        <div className="bg-zinc-900 text-gray-100 shadow border border-gray-700 rounded-xl my-2">
                            <div className="m-3 sm:m-5 flex flex-col">
                                <div className="flex items-start gap-1">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-20 h-20 rounded-full overflow-hidden cursor-pointer flex-shrink-0"
                                        >
                                            <ClickableImage
                                                src={user.image || "/default-pfp.svg"}
                                                alt="profile picture"
                                                className="rounded-full w-full h-full object-cover border-2 border-gray-100 hover:border-orange-500"
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-1">
                                            <h1 className="text-2xl font-bold">{user.name}</h1>
                                            <div className="hidden sm:flex flex-col space-y-1">
                                                {user.location ? (
                                                    <div className="flex items-center text-orange-400">
                                                        <MapPin size={20} className="mr-2" />
                                                        <p className="text-sm">{user.location}</p>
                                                    </div>
                                                ) : isOwnProfile && (
                                                    <div className="flex items-center text-orange-400 opacity-70">
                                                        <MapPin size={20} className="mr-2" />
                                                        <p className="text-sm">Add your location</p>
                                                    </div>
                                                )}
                                                <p className="text-sm text-gray-400">
                                                    Joined {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {session?.user?.id &&
                                        (isOwnProfile ? (
                                            <EditProfileModal
                                                image={user.image}
                                                name={user.name}
                                                location={user.location || ""}
                                                bio={user.bio || ""}
                                            />
                                        ) : (
                                            <div className="relative ml-auto">
                                                {/* This component handles blocking and unblocking */}
                                                <ProfileMenuButton
                                                    userSlug={user.slug}
                                                    userId={user.id}
                                                    userName={user.name}
                                                />
                                            </div>
                                        ))
                                    }
                                </div>
                                {user.bio ? (
                                    <p className="mt-3 text-gray-300 whitespace-pre-line">
                                        {user.bio}
                                    </p>
                                ) : isOwnProfile && (
                                    <p className="mt-3 text-gray-300 opacity-70">
                                        Add a profile bio by clicking the edit button in the top-right corner
                                    </p>
                                )}
                                {/* This component needs to be stately: it should appear immediately after blocking and not as a result of a database fetch after refreshing the page */}
                                <BlockedInfoContainer />
                                {/* Location and Join Date */}
                                <div className="sm:hidden flex justify-between my-1 mt-3">
                                    {user.location ? (
                                        <div className="flex items-center text-orange-400">
                                            <MapPin size={20} className="mr-2" />
                                            <p className="text-sm">{user.location}</p>
                                        </div>
                                    ) : isOwnProfile && (
                                        <div className="flex items-center text-orange-400 opacity-70">
                                            <MapPin size={20} className="mr-2" />
                                            <p className="text-sm">Add your location</p>
                                        </div>
                                    )}
                                    <p className="text-sm  text-gray-400 ml-auto mr-1">
                                        Joined {new Date(user.createdAt).toLocaleDateString("en-US", {
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
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
                            {dummyComments.map((review, index) => ( // bg-zinc-900 text-gray-200 shadow border border-gray-700 rounded-xl
                                <div key={index} className="border border-gray-700 rounded-xl p-4 bg-zinc-900 text-gray-200 shadow space-y-3">
                                    <div className="flex flex-col md:flex-row items-start justify-between mb-2 gap-2">
                                        <div className="flex items-center gap-3">
                                            <UserCircle2 className="w-6 h-6 text-gray-400" />
                                            <p className="font-medium">{review.username}</p>
                                        </div>
                                        <StarRating rating={review.rating} />
                                    </div>
                                    <ClickableImage
                                        src="https://res.cloudinary.com/dx83fnzoj/image/upload/v1748647101/reports/garage_sale6_fxkgb9.jpg"
                                        alt="Garage sale house"
                                        className="rounded-lg object-cover w-full"
                                    />
                                    <p className="text-sm text-gray-300">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ProfileBlockProvider>
    )
};

export default UserPage
