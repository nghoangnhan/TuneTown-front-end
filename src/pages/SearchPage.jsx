const SearchPage = () => {
  return (
    <div className="text-white bg-[#ecf2fd] min-h-screen pt-16">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl text-[#2E3271] font-bold mb-4">Search Page</h1>
        <div className=" mx-auto bg-white rounded-lg p-4 shadow-lg">
          <input
            type="text"
            className="w-full border text-black border-gray-300 p-2 rounded mb-4"
            placeholder="Search..."
          />
          <button className="bg-[#86c996] text-white py-2 px-4 rounded hover:bg-[#8bde9e]  right-0">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
