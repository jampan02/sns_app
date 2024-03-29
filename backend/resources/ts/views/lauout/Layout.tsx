import axios from "axios";
import React, { useEffect, ReactNode, useState } from "react";
import { Link } from "react-router-dom";

import { useHistory } from "react-router";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import Container from "@material-ui/core/Container";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import PostAddIcon from "@material-ui/icons/PostAdd";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MediaQuery from "react-responsive";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { logout_user } from "../../store/counter/user/action";
type PROPS = {
    children: ReactNode;
};

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}

            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex"
    },
    toolbar: {
        paddingRight: 24 // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar
    },
    appBar: {
        [theme.breakpoints.down("sm")]: {
            paddingTop: "5px",
            paddingBottom: "5px"
        },

        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        position: "fixed"
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        position: "fixed"
    },
    menuButton: {
        marginRight: 36
    },
    menuButtonHidden: {
        display: "none"
    },
    title: {
        flexGrow: 1
    },
    drawerPaper: {
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        }),
        height: "100vh"
    },
    drawerPaperClose: {
        [theme.breakpoints.down("sm")]: {
            //スマホ状態で左側のバーを隠す
            display: "none"
        },
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9)
        }
    },
    appBarSpacer: theme.mixins.toolbar,
    appBarSpacerContainer: {
        height: "100vh"
    },
    content: {
        flexGrow: 1,

        overflow: "auto"
    },
    openedContent: {
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        height: "100%",

        opacity: "0.3",

        zIndex: 1
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4)
    },
    paper: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column"
    },
    fixedHeight: {
        height: 240
    },
    searchButton: {
        marginLeft: "10px"
    },
    buttonIcon: {
        marginRight: "0.5rem"
    },
    searchContainer: {
        display: "flex"
    },
    siteImage: {
        height: "3rem",
        "&:active": {
            opacity: 0.8
        }
    }
}));
const Layout: React.FC<PROPS> = ({ children }) => {
    const user = useSelector((state: RootState) => state.user.user);
    const history = useHistory();
    const [keyword, setKeyword] = useState("");
    const [isPost, setIsPost] = useState(true);
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const mainListItems = (
        <div>
            <ListItem button onClick={() => history.push("/create")}>
                <ListItemIcon>
                    <PostAddIcon />
                </ListItemIcon>
                <ListItemText primary="投稿" />
            </ListItem>
            <ListItem button onClick={() => history.push("/user")}>
                <ListItemIcon>
                    <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="ユーザー" />
            </ListItem>
        </div>
    );

    const secondaryListItems = (
        <div>
            <ListSubheader inset>設定</ListSubheader>
            <ListItem button onClick={() => history.push("/setting")}>
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="設定" />
            </ListItem>
        </div>
    );
    const logout = async () => {
        await axios
            .post("/logout")
            .then(() => {
                dispatch(logout_user());
            })
            .catch(error => {
                console.log(error);
            });
    };
    const logoutListItem = (
        <div>
            <ListItem button onClick={logout}>
                <ListItemIcon>
                    <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="ログアウト" />
            </ListItem>
        </div>
    );
    const loginListItem = (
        <div>
            <ListItem button onClick={() => history.push("/register")}>
                <ListItemIcon>
                    <LockOpenIcon />
                </ListItemIcon>
                <ListItemText primary="ログイン" />
            </ListItem>
        </div>
    );

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const onSearch = () => {
        if (keyword === "") {
            return;
        }
        if (isPost) {
            history.push({
                pathname: "/search/post",
                search: `?q=${keyword}`
            });
        } else {
            history.push({
                pathname: "/search/user",
                search: `?q=${keyword}`
            });
        }
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                className={clsx(classes.appBar, open && classes.appBarShift)}
            >
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        className={clsx(
                            classes.menuButton,
                            open && classes.menuButtonHidden
                        )}
                    >
                        <MenuIcon />
                    </IconButton>
                    <MediaQuery query="(min-width: 720px)">
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            className={classes.title}
                        >
                            <Link to="/">
                                <img
                                    src="/site_icon.png"
                                    alt="サイトアイコン"
                                    className={classes.siteImage}
                                />
                            </Link>
                        </Typography>
                    </MediaQuery>

                    <div className={classes.searchContainer}>
                        <IconButton
                            onClick={() => setIsPost(!isPost)}
                            className={classes.buttonIcon}
                        >
                            {isPost ? <LibraryBooksIcon /> : <PersonIcon />}
                        </IconButton>
                        <TextField
                            label={isPost ? <>投稿検索</> : <>ユーザー検索</>}
                            type="search"
                            variant="filled"
                            defaultValue={keyword}
                            onChange={e => setKeyword(e.target.value)}
                            onKeyPress={e => {
                                if (e.key == "Enter") {
                                    e.preventDefault();
                                    onSearch();
                                }
                            }}
                        />
                    </div>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                classes={{
                    paper: clsx(
                        classes.drawerPaper,
                        !open && classes.drawerPaperClose
                    )
                }}
                open={open}
            >
                <div className={classes.toolbarIcon}>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>{mainListItems}</List>
                <Divider />
                <List>{secondaryListItems}</List>
                <Divider />

                {user ? (
                    <List>{logoutListItem}</List>
                ) : (
                    <List>{loginListItem}</List>
                )}
            </Drawer>
            <main className={open ? classes.openedContent : classes.content}>
                <div className={classes.appBarSpacer} />
                <Container
                    maxWidth="sm"
                    className={classes.container}
                    component="main"
                >
                    <CssBaseline />

                    {children}

                    <Box pt={4}></Box>
                </Container>
            </main>
        </div>
    );
};

export default Layout;
