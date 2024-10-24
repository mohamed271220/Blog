const ContentInput = ({ content, setContent }) => (
    <div>
        <label className="block text-gray-700">Content:</label>
        <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-gray-300"
            required
        />
    </div>
);

export default ContentInput;