const TitleInput = ({ title, setTitle }) => (
    <div>
        <label className="block text-gray-700">Title:</label>
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-gray-300"
            required
        />
    </div>
);

export default TitleInput;
