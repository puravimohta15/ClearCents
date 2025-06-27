import {SignedIn, SignedOut, SignInButton, SignUpButton,SignOutButton, UserButton} from "@clerk/clerk-react";

export const Auth = () => {
    return <div className="sign-in-container">
        <SignedIn>
            <UserButton />
            <SignOutButton />
        </SignedIn>
        <SignedOut>
            <SignInButton mode="modal" />
            <SignUpButton mode="modal" />
        </SignedOut>
    </div>
}