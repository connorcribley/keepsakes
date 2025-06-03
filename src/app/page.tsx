import Image from '@/components/Image';

const Home = () => {
  return (
    <>
      <div className="absolute inset-0 -z-10">
        <Image
          src="reports/garage_sale12_qckkhr"
          alt="Garage Sale Background"
          width={1920}
          height={1080}
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      <div className="flex flex-col items-center text-center justify-center h-full text-white mx-16">
        <h1 className="text-5xl font-bold mb-8">Welcome to Keepsakes</h1>
        <p className="text-xl mb-4">Find garage sales, yard sales, and estate sales near you!</p>
      </div>
    </>
  )
}

export default Home;