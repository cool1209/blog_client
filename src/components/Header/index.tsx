// node_modules
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
    Flex,
    Box,
    Heading,
    Spacer,
    Button,
    Menu,
    MenuList,
    MenuButton,
    MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";

// context
import AuthContext from "../../store/auth-context";

// states
import { RootState } from "../../store";

// consts
import { PATH } from "../../consts";

const HeaderComponent: React.FC = () => {
    const authContext = useContext(AuthContext);
    const me = useSelector((state: RootState) => state.me.me);

    return (
        <Flex bgColor={"darkgray"} padding={"10px"}>
            <Box p="2">
                <Link to={PATH.HOME}>
                    <Heading size="md">Test Blog</Heading>
                </Link>
            </Box>
            <Spacer />
            {authContext.isLoggedIn ? (
                <Box>
                    <Link to={PATH.BLOGS}>
                        <Button colorScheme="teal" mr="4">
                            Blogs
                        </Button>
                    </Link>
                    <Link to={PATH.NEWBLOG}>
                        <Button colorScheme="teal" mr="4">
                            New Blog
                        </Button>
                    </Link>
                    <Menu>
                        {({ isOpen }) => (
                            <>
                                <MenuButton
                                    isActive={isOpen}
                                    as={Button}
                                    rightIcon={<ChevronDownIcon />}
                                    colorScheme="teal"
                                >
                                    {me.username}
                                </MenuButton>
                                <MenuList>
                                    <Link to={PATH.PROFILE}>
                                        <MenuItem>Profile</MenuItem>
                                    </Link>
                                    <MenuItem onClick={authContext.logout}>
                                        Logout
                                    </MenuItem>
                                </MenuList>
                            </>
                        )}
                    </Menu>
                </Box>
            ) : (
                <Box>
                    <Link to={PATH.SIGNIN}>
                        <Button colorScheme="teal" mr="4">
                            Sign in
                        </Button>
                    </Link>
                    <Link to={PATH.SIGNUP}>
                        <Button colorScheme="teal">Sign Up</Button>
                    </Link>
                </Box>
            )}
        </Flex>
    );
};

export default HeaderComponent;
