import React from "react";
import { render, screen } from "@testing-library/react";
import SignInFormComponent from "./";

describe("SignIn", () => {
    beforeEach(() => {
        render(<SignInFormComponent />);
    });

    test("renders Sign In form", () => {
        const signInElement = screen.getByText("Sign in!");
        expect(signInElement).toBeInTheDocument();
    });

    test("renders email field", () => {
        const emailElement = screen.getByPlaceholderText("Email");
        expect(emailElement).toBeInTheDocument();
    });

    test("renders password field", () => {
        const passwordElement = screen.getByPlaceholderText("Password");
        expect(passwordElement).toBeInTheDocument();
    });
});
