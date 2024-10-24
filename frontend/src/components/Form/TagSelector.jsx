const TagSelector = ({ tags, selectedTags, handleTagChange }) => (
    <div>
        <label className="block text-gray-700">Tags:</label>
        <div className="flex flex-wrap">
            {tags.map((tag) => (
                <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagChange(tag.id)}
                    className={`mr-2 mb-2 px-4 py-2 rounded transition-all ${selectedTags.includes(tag.id) ? 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
                        : 'bg-gray-300 dark:bg-gray-600 opacity-70 text-gray-800 dark:text-gray-200 hover:bg-gray-400 hover:dark:bg-gray-500'}`}

                >
                    {tag.name}
                </button>
            ))}
        </div>
    </div>
);

export default TagSelector;

