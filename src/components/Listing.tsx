'use client';

import Image from './Image';
import Link from 'next/link';
import { useState } from 'react';
import { X } from 'lucide-react';
import StarRating from './StarRating';

// interface ListingProps {
//   houseImg: string;
//   address: string;
//   user: string;
//   description?: string;
//   items: string[];
// }

interface Item {
  src: string;
  name: string;
  price: number;
  description: string;
}

const Listing = (/* {
  houseImg,
  address,
  user,
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.",
  items,
}: ListingProps */) => {
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

  return (
    <div className="border-2 border-orange-400 rounded-2xl p-4 text-gray-200 shadow-sm mx-auto w-full max-w-6xl m-2">

      <div className="flex flex-col gap-4">


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
            <Link href={`/listing/${'12345'}`}>
              <h2 className="text-xl my-1 font-bold hover:underline">123 Sesame St, New York, NY 10024</h2>
            </Link>
            <div className="flex space-x-2 cursor-pointer hover:underline">
              <StarRating rating={4.5} />
              <span className='font-semibold text-amber-400'>{"(3)"}</span>
            </div>
            <p className="text-sm my-1 text-gray-400">Posted by <Link href="/user/12345" className="cursor-pointer hover:underline">Bert</Link> on June 1st, 2025</p>
            <p className="text-sm my-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestiae, error alias. Error velit labore, asperiores facilis deleniti sequi adipisci laudantium eaque quos nam dolore eius inventore debitis, mollitia impedit porro.</p>
          </div>
        </div>

        {/* Item Thumbnails */}
        <h1 className='font-bold text-gray-200 text-lg'>Items for sale:</h1>
        <div className="relative">
          <div className="overflow-x-auto mt-2" style={{ paddingBottom: '16px' }}>
            <div className="flex space-x-3 w-max">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 rounded-lg overflow-hidden"
                  onClick={() => setSelectedItem(item)}
                >
                  <Image
                    src={item.src}
                    alt={`Item ${index + 1}`}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover w-24 h-24 border border-gray-200 cursor-pointer"
                  />
                </div>
              ))}
            </div>
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
                className="absolute -top-4 -right-4 bg-white text-black rounded-full p-1 cursor-pointer"
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
                className="absolute -top-4 -right-4 bg-white text-black rounded-full p-1 cursor-pointer"
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
              <p className="text-orange-400 text-md mt-1">Price: ${selectedItem.price}</p>
              <p className="text-gray-300 text-md mt-1">{selectedItem.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Listing;
