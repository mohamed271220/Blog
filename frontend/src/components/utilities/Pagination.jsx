const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [...Array(totalPages).keys()].map((_, i) => i + 1);

    return (
        <div className="flex justify-center mt-4">
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`mx-1 px-4 py-2 rounded transition-all 
                        ${page === currentPage 
                            ? 'bg-blue-600 dark:bg-blue-600 text-white font-semibold hover:bg-blue-700' // Selected state
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:text-gray-900'} // Unselected state
                        dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 dark:hover:text-gray-100`} // Dark mode styles
                >
                    {page}
                </button>
            ))}
        </div>
    );
};

export default Pagination;
