import AnimatedError from "../components/AnimatedError";


export default function NotFound() {
    return (
        <AnimatedError
            fileName="Error 404.json"
            title="Page Not Found"
            message="The page you are looking for does not exist."
        />
    );
}