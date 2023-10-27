const SearchPage = () => {
  return (
    <div className="text-white bg-[#B9C0DE] min-h-screen pt-16">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Search Page</h1>
        <div className=" mx-auto bg-white rounded-lg p-4 shadow-lg">
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded mb-4"
            placeholder="Search..."
          />
          <button className="bg-[#86c996] text-white py-2 px-4 rounded hover:bg-[#8bde9e]">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
