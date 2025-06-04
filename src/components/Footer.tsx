import Link from "next/link";

const Footer = () => {
  return (
    <div className="bg-black text-white text-center py-2 h-[40px] fixed w-full bottom-0">
      &#169; 2025 <Link href={"https://connorcribley.vercel.app/"} className="cursor-pointer hover:underline">Connor Cribley</Link>
    </div>
  )
};

export default Footer
