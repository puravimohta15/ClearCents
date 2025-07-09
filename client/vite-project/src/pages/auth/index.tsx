import {SignedIn, SignedOut, SignInButton, SignUpButton,SignOutButton, UserButton} from "@clerk/clerk-react";
import {Navigate} from "react-router-dom";
export const Auth = () => {
    return <div className="sign-in-container">
        <SignedIn>
            {/* <UserButton />
            <SignOutButton /> */}
            <Navigate to="/"/>
        </SignedIn>
        <SignedOut>
            <SignInButton mode="modal" />
            <SignUpButton mode="modal" />
        </SignedOut>
    </div>
}