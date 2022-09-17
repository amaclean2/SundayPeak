import { useCardStateContext, useFollowUser, useUserStateContext } from "../../Providers";
import { Button, FooterButtons } from "../Reusable"

const UserProfileButtons = () => {
    const { handleLogout, workingUser, loggedInUser } = useUserStateContext();
    const { closeCard } = useCardStateContext();
    const { followUser } = useFollowUser();

    const logout = () => {
        handleLogout().then(() => closeCard());
    };

    const editUser = () => {

    };

    const handleFollow = () => {
        followUser({ leaderId: workingUser.id });
    };

    return (
        <FooterButtons>
            {workingUser.id === loggedInUser.id ? (
                <>
                    <Button
                        id="logout-button"
                        onClick={logout}
                        className="button adventure-add-button"
                    >
                        Logout
                    </Button>
                    <Button
                        id="edit-user-button"
                        onClick={editUser}
                        className="button adventure-add-button"
                    >
                        Edit
                    </Button>
                </>
            ) : (
                <>
                    <Button
                        id="follow-user-button"
                        onClick={handleFollow}
                        className="button adventure-add-button"
                    >
                        Follow
                    </Button>

                </>
            )}
        </FooterButtons>
    )
};

export default UserProfileButtons;