

interface Props {
    address: String | null
}

const LocationPopup = ({ address }: Props) => {
  return (
    <div className="rounded-2xl p-4 text-gray-200 shadow-sm mx-auto w-full max-w-6xl m-2">
      <div className="flex flex-col gap-4">
        <h1 className="text-xl">
            Current Location:
        </h1>
        {address ? (<p className="test-lg">{address}</p>) : (<p className="text-lg">No address found</p>) }
      </div>
    </div>
  )
};

export default LocationPopup
