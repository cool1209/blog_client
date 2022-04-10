// node_modules
import React from "react";
import { Flex } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

// components
import HeaderComponent from "../Header";

// consts
import { PATH } from "../../consts";

const LayoutComponent: React.FC = (props) => {
    const location = useLocation();

    return (
        <>
            <HeaderComponent></HeaderComponent>
            <Flex
                justify="center"
                align="center"
                w="100%"
                // h={
                //     location.pathname === PATH.HOME ||
                //     location.pathname === PATH.SIGNIN ||
                //     location.pathname === PATH.SIGNUP
                //         ? "87vh"
                //         : ""
                // }
                h="87vh"
            >
                {props.children}
            </Flex>
        </>
    );
};

export default LayoutComponent;
