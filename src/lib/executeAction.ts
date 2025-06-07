import { isRedirectError } from "next/dist/client/components/redirect-error";

type Options<T> = {
    actionFn: () => Promise<T>;
    successMessage?: string;
}

const executeAction = async <T>({
    actionFn,
    successMessage = "Action completed successfully",
}: Options<T>): Promise<{ sucess: boolean; message: string; }> => {
    try {
        await actionFn();

        return {
            sucess: true,
            message: successMessage,
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        return {
            sucess: false,
            message: "An error has occurred"
        };
    }
}

export default executeAction;