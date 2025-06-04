"use client";

import Image from "@/components/Image";
import Link from "next/link";
import StarRating from "@/components/StarRating";
import { useState } from "react";
import { X, UserCircle2, ChevronUp, ChevronDown, ImageIcon} from "lucide-react";

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
    const [itemsOpen, setItemsOpen] = useState(true);
    const [commentsOpen, setCommentsOpen] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: '',
        comment: '',
        rating: 5,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("New Review:", form);
        // You could push to dummyComments here if testing locally:
        // setDummyComments(prev => [...prev, form]);
        setForm({ title: '', comment: '', rating: 5 });
    };

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
            <div className="flex flex-col lg:flex-row flex-wrap max-w-6xl mt-3">

                {/* House Image */}
                <div className="flex-1 flex-col">
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
                            <h2 className="text-2xl my-1 font-bold">123 Sesame St, New York, NY 10024</h2>
                            <StarRating rating={4.5} />
                            <p className="text-sm my-1 text-gray-400">Posted by <Link href="/user/12345" className="cursor-pointer hover:underline">Bert</Link></p>
                            <p className="text-sm my-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quos nam dolore eius inventore debitis, mollitia impedit porro.</p>
                        </div>
                    </div>


                    {/* Toggle Item List */}
                    <div
                        className="flex items-center justify-start cursor-pointer select-none"
                        onClick={() => setItemsOpen(prev => !prev)}
                    >
                        <h1 className="text-xl font-semibold text-gray-200 my-4">
                            Items for Sale <span>({items.length})</span>
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
                            <div className="flex flex-col space-y-2">
                                {items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-4 bg-zinc-900 rounded-lg p-3 shadow"
                                    >
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
                    )}
                </div>

                {/* Reviews */}
                <div className="my-5 w-full lg:w-[400px] flex-shrink-0">
                    <div
                        className="flex items-center justify-start cursor-pointer select-none mb-4"
                        onClick={() => setCommentsOpen(prev => !prev)}
                    >
                        <h1 className="text-xl font-semibold text-gray-200">
                            User Reviews <span>({dummyComments.length})</span>
                        </h1>
                        {commentsOpen ? (
                            <ChevronUp size={30} className="mx-2 text-gray-400" />
                        ) : (
                            <ChevronDown size={30} className="mx-2 text-gray-400" />
                        )}
                    </div>

                    {commentsOpen && (
                        <div className="space-y-4 pb-6">
                            {/* Review Form */}
                            <form
                                onSubmit={handleSubmit}
                                className="border border-gray-700 rounded-xl p-4 bg-zinc-950 text-gray-200 shadow space-y-3"
                            >
                                <h2 className="text-lg font-semibold">Leave a Review</h2>

                                <div>
                                    <label className="text-sm block mb-1 text-gray-400">Review Title</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        required
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <label className="text-sm block text-gray-400">Image</label>
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <ImageIcon className="w-6 h-6 text-gray-400 hover:text-orange-400" />
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="image-upload"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setForm((prev) => ({ ...prev, image: file }));
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setPreviewImage(reader.result as string);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    {previewImage && (
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-16 h-16 rounded object-cover border border-gray-600"
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm block mb-1 text-gray-400">Comment</label>
                                    <textarea
                                        value={form.comment}
                                        onChange={(e) => setForm({ ...form, comment: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        required
                                    />
                                </div>

                                {/* Optional: Star rating selector */}
                                <div>
                                    <label className="text-sm block mb-1 text-gray-400">Rating</label>
                                    <select
                                        value={form.rating}
                                        onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-gray-600"
                                    >
                                        <option value={5}>★★★★★</option>
                                        <option value={4}>★★★★☆</option>
                                        <option value={3}>★★★☆☆</option>
                                        <option value={2}>★★☆☆☆</option>
                                        <option value={1}>★☆☆☆☆</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded"
                                >
                                    Submit Review
                                </button>
                            </form>

                            {/* Existing mapped reviews */}
                            {dummyComments.map((review, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-700 rounded-xl p-4 bg-zinc-900 text-gray-200 shadow space-y-3"
                                >
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

export default ListingPage
