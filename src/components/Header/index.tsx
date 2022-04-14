// node_modules
import React, { useContext } from "react";
import { useHistory, Link } from "react-router-dom";
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
    Image,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";

// store
import { RootState } from "../../store";
import { logout } from "../../store/me-slice";

// context
import AuthContext from "../../store/auth-context";

// config
import { BASE_SERVER_API_URL } from "../../config";

// consts
import { PATH } from "../../consts";

const HeaderComponent: React.FC = () => {
    const authContext = useContext(AuthContext);
    const dispatch = useDispatch();
    const history = useHistory();
    const me = useSelector((state: RootState) => state.me.me);

    const logoutHandler = () => {
        dispatch(logout());
        authContext.logout();
        history.push(PATH.HOME);
    };

    return (
        <Flex bgColor={"darkgray"} padding={"10px"}>
            <Box p="2">
                <Link to={PATH.HOME}>
                    <Heading size="md">Test Blog</Heading>
                </Link>
            </Box>
            <Spacer />
            {authContext.isLoggedIn ? (
                <Box display={"flex"} alignItems={"center"}>
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
                                    <MenuItem onClick={logoutHandler}>
                                        Logout
                                    </MenuItem>
                                </MenuList>
                            </>
                        )}
                    </Menu>
                    {me.photoUrl && (
                        <Image
                            width={"50px"}
                            height={"50px"}
                            borderRadius={"100%"}
                            display={"inline"}
                            ml={"8px"}
                            src={`${BASE_SERVER_API_URL}${me.photoUrl}`}
                        />
                    )}
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
