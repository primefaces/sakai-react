import React, { Component, Fragment } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { AuthService } from "../../service/AuthService";
import Cookies from "js-cookie";

import { Toast } from "primereact/toast";

import formValidation from "../../utils/formValidation";
import jwtDecode from "jwt-decode";

class Login extends Component {
    constructor(props) {
        super(props);
        this.AuthService = new AuthService();
    }

    state = {
        credential: {
            username: "",
            password: "",
        },
        mandatoryFields: [
            { name: "username", label: "Username" },
            { name: "password", label: "Password" },
        ],
        errors: {},
    };

    handleFormChangeCredential = (event) => {
        let credentialNew = { ...this.state.credential };
        credentialNew[event.target.name] = event.target.value;
        this.setState({
            credential: credentialNew,
        });
    };

    handleKeyPress = (e) => {
        if (e.key === "Enter") {
            this.login();
        }
    };

    login = async () => {
        try {
            const formData = new FormData();
            formData.append("username", this.state.credential.username);
            formData.append("password", this.state.credential.password);
            let loginPost = await this.AuthService.postLogin(formData);
            console.log("anjay : ", loginPost);
            if (loginPost.status) {
                // failed
                if (loginPost.status === 401) this.toast.show({ severity: "error", sticky: true, summary: loginPost.data.detail });
            } else {
                this.toast.show({severity:'success', summary:'Sukses bro'})
                await Cookies.set("user", JSON.stringify(loginPost.data));
                const userId = await jwtDecode(loginPost.data.access_token).id;
                const userData = await this.AuthService.getUserById(userId);
                await Cookies.set("userData", JSON.stringify(userData.data));
                window.location.href = "/";
            }
        } catch (err) {
            console.log(err);
        }
    }

    componentDidMount() {
        const expired = Cookies.get("login_expired");
        if (expired) {
            this.toast.show({ severity: "error", sticky: true, summary: "Session Expired!", detail: "You must re-login to access the page" });
            Cookies.remove("login_expired");
        }
        const unauthorization = Cookies.get("unauthorization");
        if (unauthorization) {
            this.toast.show({ severity: "error", sticky: true, summary: "You Are Not Authorized!", detail: "You must re-login to access the page" });
            Cookies.remove("unauthorization");
        }
    }

    checkMandatory = async () => {
        await this.setState({ errors: {} })
        let formData = this.state.credential
        Object.keys(formData).forEach(async (key) => {
            let check = await this.state.mandatoryFields.find(el => el.name === key)
            if (check) {
                let result = formValidation(check.label, 'mandatory', formData[key])
                if (result) {
                    await this.setState({
                        errors: {
                            ...this.state.errors,
                            [key]: result
                        }
                    })
                    await this.setState({ saveButtonDisable: true })
                }
            }
        })
    }

    render() {
        return (
            <Fragment>
                <Toast ref={(el)=> this.toast = el} />
                <Paper
                    sx={{
                        p: 2,
                        margin: "auto",
                        maxWidth: 500,
                        flexGrow: 1,
                        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#1A2027" : "#fff"),
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <span className="p-float-label">
                                        <InputText id="in" name="username" value={this.state.credential.username} onChange={this.handleFormChangeCredential} />
                                        <label htmlFor="in">Username</label>
                                    </span>
                                </Grid>
                                <Grid item xs>
                                    <span className="p-float-label">
                                        <InputText id="in" type="password" name="password" value={this.state.credential.password} onChange={this.handleFormChangeCredential} />
                                        <label htmlFor="pw">Password</label>
                                    </span>
                                </Grid>
                                <Grid item>
                                    <Button onClick={this.login} label="Save" />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Fragment>
        );
    }
}

export default Login;
