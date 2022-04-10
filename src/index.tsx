import { ColorModeScript, ChakraProvider, theme } from "@chakra-ui/react";
import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./store/auth-context";
import store from "./store";

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <Provider store={store}>
                <BrowserRouter>
                    <ColorModeScript />
                    <ChakraProvider theme={theme}>
                        <App />
                    </ChakraProvider>
                </BrowserRouter>
            </Provider>
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
