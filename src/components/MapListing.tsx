'use client';

import Image from './Image';
import Link from 'next/link';
import { useState } from 'react';
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

const MapListing = (/* {
  houseImg,
  address,
  user,
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.",
  items,
}: ListingProps */) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedItem, setSelectedItem] = useState<Item | null>(null);

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
    <div className="rounded-2xl p-4 text-gray-200 shadow-sm mx-auto w-full max-w-6xl m-2">

      <div className="flex flex-col gap-4">


        {/* House Image */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-[300px] rounded-lg overflow-hidden cursor-pointer"
            /* onClick={() => setIsModalOpen(true)} */>
            <Image
              src="listings/house9_xhspdp"
              alt="Garage sale house"
              width={600}
              height={300}
              className="rounded-lg object-cover w-full border border-gray-200"
            />
            {/* <img
              src="https://res.cloudinary.com/dx83fnzoj/image/upload/c_scale,w_600/listings/house9_xhspdp.jpg"
              alt="Garage sale house"
              className="rounded-lg object-cover w-full border border-gray-200"
            /> */}
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
                  /* onClick={() => setSelectedItem(item)} */
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
      </div>
    </div>
  );
};

export default MapListing;
