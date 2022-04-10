import React from "react";
import { render, screen } from "@testing-library/react";
import SignUpFormComponent from "./";

describe("SignInFormComponent", () => {
    beforeEach(() => {
        render(<SignUpFormComponent />);
    });

    test("renders Sign up form", () => {
        const signUpElement = screen.getByText("Sign up!");
        expect(signUpElement).toBeInTheDocument();
    });

    test("renders user name field", () => {
        const userNameElement = screen.getByPlaceholderText("User name");
        expect(userNameElement).toBeInTheDocument();
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
