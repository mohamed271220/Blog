const CategorySelector = ({ categories, selectedCategories, handleCategoryChange }) => (
    <div>
        <label className="block text-gray-700 dark:text-gray-300">Categories:</label>
        <div className="flex flex-wrap">
            {categories.map((category) => (
                <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryChange(category.id)}
                    className={`mr-2 mb-2 px-4 py-2 rounded transition-all 
                        ${selectedCategories.includes(category.id) 
                            ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700' 
                            : 'bg-gray-300 dark:bg-gray-600 opacity-70 text-gray-800 dark:text-gray-200 hover:bg-gray-400 hover:dark:bg-gray-500'}`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    </div>
);

export default CategorySelector;
