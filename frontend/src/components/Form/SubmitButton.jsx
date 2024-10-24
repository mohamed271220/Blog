import Button from "../Buttons/Button";

const SubmitButton = ({ disabled }) => (
    <Button type="submit"
        disabled={disabled}
        color="blue"
        className="">Create Post</Button>
);

export default SubmitButton;