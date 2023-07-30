import { Loader } from "@mantine/core";

interface LoaderProps {
    message: string
}

const ScreenLoader:React.FC<LoaderProps> = ({message=""}) => {
    return <div className="w-full h-full flex justify-center items-center flex-col space-y-2">
        <Loader/>
        <p className="text-gray-400 font-semibold">{message}</p>
    </div>
}

export default ScreenLoader;