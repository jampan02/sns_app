import axios from "axios";
import React, { useEffect, ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { POST } from "../../utils/type";
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
import Badge from "@material-ui/core/Badge";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleIcon from "@material-ui/icons/People";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import AssignmentIcon from "@material-ui/icons/Assignment";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import PostAddIcon from "@material-ui/icons/PostAdd";
import PersonIcon from "@material-ui/icons/Person";
import SettingsIcon from "@material-ui/icons/Settings";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { useSelector } from "react-redux";
import { RootState } from "../../store";
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
    }
}));
const Layout: React.FC<PROPS> = ({ children }) => {
    const user = useSelector((state: RootState) => state.user.user);
    const history = useHistory();
    const [keyword, setKeyword] = useState("");
    const [isPost, setIsPost] = useState(true);
    const classes = useStyles();
    const [open, setOpen] = useState(false);
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
            .then(res => {
                history.push("/login");
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
                    <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="新規登録" />
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
                position="absolute"
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

                    <Typography
                        component="h1"
                        variant="h6"
                        color="inherit"
                        noWrap
                        className={classes.title}
                    >
                        <Link to="/">SNS</Link>
                    </Typography>

                    <div>
                        <IconButton onClick={() => setIsPost(!isPost)}>
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

                        <Button
                            variant="contained"
                            color="primary"
                            endIcon={<SearchIcon />}
                            onClick={onSearch}
                            className={classes.searchButton}
                        >
                            検索
                        </Button>
                    </div>
                    <IconButton color="inherit">
                        <Badge badgeContent={4} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
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
            <main className={classes.content}>
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
