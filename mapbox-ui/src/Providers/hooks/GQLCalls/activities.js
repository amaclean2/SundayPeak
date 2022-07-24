import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import { CREATE_ACTIVITY } from "../TypeDefs";
import { useGetUser } from "./users";

export const useSaveActivity = () => {
    const [
        start,
        { data, error, loading }
    ] = useMutation(CREATE_ACTIVITY);

    const { refetch: refetchUser } = useGetUser();

    const saveActivity = ({ adventureId }) => start({ variables: { adventureId, public: false }});

    useEffect(() => {
        console.log("DATA_FROM_ACTIVITIES", data, error, loading);
        if (data?.createActivity) {
            refetchUser();
        }
    }, [data, error, loading]);

    return {
        saveActivity,
        data
    };
};