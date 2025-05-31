"use client";

import { notFound } from "next/navigation";
import Image from "@/components/Image";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { useState } from "react";
import { X } from "lucide-react";

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

const ListingPage = ({ params }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const items: Item[] = [
        { src: "items/rocking_horse_oyhqq9", name: "Rocking Horse", price: 25, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
        { src: "items/soccer_ball_xozmbs", name: "Soccer Ball", price: 15, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
        { src: "items/painting1_ao3juc", name: "Painting", price: 50, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
        { src: "items/clothes2_ydz8sl", name: "Clothes", price: 30, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
        { src: "items/books1_mcy17h", name: "Books", price: 10, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
        { src: "items/bike_du9pbg", name: "Bicycle", price: 100, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
        { src: "items/albums5_jbfaxj", name: "Vinyl Albums", price: 40, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
        { src: "items/television1_qlusja", name: "Television", price: 200, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
        { src: "items/teapot_hkn4tw", name: "Teapot", price: 20, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
        { src: "items/stereo1_hnxzqj", name: "Stereo", price: 30, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
        { src: "items/teddy_bear_dealkk", name: "Teddy Bear", price: 15, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
        { src: "items/lamp_ac8t4k", name: "Lamp", price: 35, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
        { src: "items/blender_y2f4yb", name: "Blender", price: 45, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
        { src: "items/doll_pwrlt5", name: "Doll", price: 20, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
        { src: "items/basket_ball_fny6bs", name: "Basketball", price: 18, description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quo nam dolore eius inventore devitis, mollitia impedit porro." },
    ]

    // const listing = {
    //     id,
    //     address: '123 Sesame St, New York, NY',
    //     postedBy: 'Bert',
    //     description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Officiis, animi quidem. Aut ratione temporibus delectus culpa fugit saepe consequuntur quod id voluptatum aliquid, quam nobis voluptate vel, assumenda suscipit repudiandae.",
    //     image: 'listings/house9_xhspdp',
    //     items: [
    //         { src: 'items/item1', name: 'Old Lamp', price: '$10' },
    //         { src: 'items/item2', name: 'Bookshelf', price: '$25' },
    //     ],
    // };


    return (

        <div className="flex flex-col gap-4 m-6">


            {/* House Image */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <div className="mb-1 rounded-lg overflow-hidden md:max-w-sm cursor-pointer"
                    onClick={() => setIsModalOpen(true)}>
                    <Image
                        src="listings/house9_xhspdp"
                        alt="Garage sale house"
                        width={600}
                        height={300}
                        className="rounded-lg object-cover w-full border border-gray-200"
                    />
                </div>


                {/* Info Section */}
                <div className="my-2 flex flex-col">
                    <h2 className="text-xl my-1 font-bold">123 Sesame St, New York, NY 10024</h2>
                    <StarRating rating={4.5} />
                    <p className="text-sm my-1 text-gray-400">Posted by Bert</p>
                    <p className="text-sm my-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quos nam dolore eius inventore debitis, mollitia impedit porro.</p>
                </div>
            </div>

            {/* Item Thumbnails */}
            <h1 className="font-bold text-gray-200 text-lg mb-2">Items for sale:</h1>
            <div className="max-h-[600px] overflow-y-auto pr-2 rounded-2xl border-2 border-gray-200">
                <div className="flex flex-col space-y-4">
                    {items.slice(0, 10).map((item, index) => (
                        <div key={index} className="flex items-center space-x-4 bg-zinc-900 rounded-lg p-3 shadow">
                            <Image
                                src={item.src}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="rounded-lg object-cover w-20 h-20 cursor-pointer border border-gray-200"
                            />
                            <div>
                                <h3 className="text-base font-semibold text-white">{item.name}</h3>
                                <p className="text-sm text-orange-400">Price: ${item.price}</p>
                                <p className="text-sm text-gray-300">{item.description}</p>
                            </div>
                        </div>
                    ))}
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

            {/* Item Modal */}
            {selectedItem && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    onClick={() => setSelectedItem(null)}
                >
                    <div className="relative bg-zinc-900 rounded-lg p-4 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute -top-4 -right-4 bg-white text-black rounded-full p-1"
                            onClick={() => setSelectedItem(null)}
                        >
                            <X size={20} />
                        </button>
                        <Image
                            src={selectedItem.src}
                            alt={selectedItem.name}
                            width={600}
                            height={400}
                            className="rounded-lg object-contain mb-4"
                        />
                        <h2 className="text-white text-xl font-semibold">{selectedItem.name}</h2>
                        <p className="text-gray-300 text-md mt-1">Price: ${selectedItem.price}</p>
                    </div>
                </div>
            )}
        </div>
    )
};

export default ListingPage
