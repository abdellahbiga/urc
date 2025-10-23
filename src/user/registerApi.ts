import { ErrorCallback } from "../model/common";
import { CustomError } from "../model/CustomError";

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface RegisterSuccess {
    message: string;
}

export function registerUser(
    data: RegisterData,
    onSuccess: (result: RegisterSuccess) => void,
    onError: ErrorCallback
) {
    fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then(async (response) => {
            if (response.ok) {
                const result = (await response.json()) as RegisterSuccess;
                onSuccess(result);
            } else {
                const error = (await response.json()) as CustomError;
                onError(error);
            }
        })
        .catch(onError);
}
