"use client";

import { notFound } from "next/navigation";
import Image from "@/components/Image";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { useState } from "react";
import { X, UserCircle2, ChevronUp, ChevronDown, MapPin } from "lucide-react";
import Listing from "@/components/Listing";

type Props = {
    params: {
        id: string;
    };
}

interface Item {
    src: string;
    name: string;
    price: number;
    description: string;
}

const UserPage = ({ params }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemsOpen, setItemsOpen] = useState(true);
    const [commentsOpen, setCommentsOpen] = useState(true);


    // const items: Item[] = [
    //     { src: "items/rocking_horse_oyhqq9", name: "Rocking Horse", price: 25, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    //     { src: "items/soccer_ball_xozmbs", name: "Soccer Ball", price: 15, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    //     { src: "items/painting1_ao3juc", name: "Painting", price: 50, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    //     { src: "items/clothes2_ydz8sl", name: "Clothes", price: 30, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    //     { src: "items/books1_mcy17h", name: "Books", price: 10, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    //     { src: "items/bike_du9pbg", name: "Bicycle", price: 100, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    //     { src: "items/albums5_jbfaxj", name: "Vinyl Albums", price: 40, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    //     { src: "items/television1_qlusja", name: "Television", price: 200, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    //     { src: "items/teapot_hkn4tw", name: "Teapot", price: 20, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    //     { src: "items/stereo1_hnxzqj", name: "Stereo", price: 30, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    //     { src: "items/teddy_bear_dealkk", name: "Teddy Bear", price: 15, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    //     { src: "items/lamp_ac8t4k", name: "Lamp", price: 35, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    //     { src: "items/blender_y2f4yb", name: "Blender", price: 45, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    //     { src: "items/doll_pwrlt5", name: "Doll", price: 20, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    //     { src: "items/basket_ball_fny6bs", name: "Basketball", price: 18, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    // ]

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
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <Image
                                        src="users/guy_t8mxvo"
                                        alt="Some guy"
                                        width={100}
                                        height={100}
                                        className="rounded-full w-full h-full object-cover border border-black"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <h2 className="text-2xl font-bold">John Doe</h2>
                                    <div className="flex items-center">
                                        <MapPin size={20} className="text-orange-400 mr-2" />
                                        <p className="text-sm text-orange-400">New York, NY</p>
                                    </div>
                                    <p className="text-sm text-gray-400">Joined June 2025</p>
                                </div>
                            </div>

                            <p className="text-sm mt-3 text-gray-300">
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eum aliquam harum, labore recusandae cupiditate repudiandae voluptas quaerat doloribus earum sequi! Dolorum hic praesentium magni officia repudiandae sapiente atque. Harum, voluptatum?
                            </p>
                        </div>
                    </div>


                    {/* Toggle Item List */}
                    <div
                        className="flex items-center justify-start cursor-pointer select-none"
                        onClick={() => setItemsOpen(prev => !prev)}
                    >
                        <h1 className="text-xl font-semibold text-gray-200 my-2">
                            Previous Listings <span>(3)</span>
                        </h1>
                        {itemsOpen ? (
                            <ChevronUp size={30} className="mx-2 text-gray-400" />
                        ) : (
                            <ChevronDown size={30} className="mx-2 text-gray-400" />
                        )}
                    </div>

                    {/* Conditionally render item list */}
                    {itemsOpen && (
                        <div className="overflow-y-auto pr-2 rounded-2xl transition-all duration-300 ease-in-out">
                            <div className="flex flex-col gap-3">
                                <Listing />
                                <Listing />
                                <Listing />
                            </div>
                        </div>
                    )}
                </div>

                {/* Reviews */}
                <div className="my-5 w-full lg:w-[400px] flex-shrink-0">
                    <div
                        className="flex items-center justify-start cursor-pointer select-none mb-4"
                        onClick={() => setCommentsOpen(prev => !prev)}
                    >
                        <h1 className="text-xl font-semibold text-gray-200">
                            Reviews Left <span>({dummyComments.length})</span>
                        </h1>
                        {commentsOpen ? (
                            <ChevronUp size={30} className="mx-2 text-gray-400" />
                        ) : (
                            <ChevronDown size={30} className="mx-2 text-gray-400" />
                        )}
                    </div>

                    {commentsOpen && (
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
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute -top-4 -right-4 bg-white text-black rounded-full p-1 "
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X size={20} />
                        </button>
                        <Image
                            src="listings/house9_xhspdp"
                            alt="Enlarged garage sale house"
                            width={800}
                            height={600}
                            className="rounded-lg max-w-full max-h-[90vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    )
};

export default UserPage
