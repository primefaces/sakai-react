import React, { Component, Fragment } from "react";
import { MDBBtn, MDBCard, MDBCardBody, MDBCardTitle, MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdbreact';

class Login extends Component {
    
    render() {
        return (
            <Fragment>
                <div className="bg">
                    <MDBContainer>
                        <MDBRow>
                            <MDBCol md='5' style={{ paddingTop: '4em', paddingRight: '5em' }}>
                                <MDBRow>
                                    <MDBCol style={{ textAlign: 'center' }}>
                                        {/* <img src={mycoLogo} className="img-fluid" alt="" width="200em" /> */}
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol>
                                        <MDBCard >
                                            <MDBCardTitle style={{ marginTop: '1em', textAlign: 'center' }}>Login</MDBCardTitle>
                                            <MDBCardBody>
                                                <MDBInput name="username" value={this.state.credential.username} label="Type your user ID" icon="user" group type="text" validate error="wrong"
                                                    success="right" onChange={this.handleFormChangeCredential} />
                                                <div style={{ color: "red", fontSize: "10px", float: "right", marginTop: "-30px" }}>{this.state.errors.username}</div>
                                                <MDBInput name="password" value={this.state.credential.password} label="Type your password" icon="lock" group type="password"
                                                    validate onChange={this.handleFormChangeCredential} onKeyDown={this.handleKeyPress} />
                                                <div style={{ color: "red", fontSize: "10px", float: "right", marginTop: "-30px" }}>{this.state.errors.password}</div>
                                                <div className="text-center">
                                                    <MDBBtn onClick={this.login}>Login</MDBBtn>
                                                </div>
                                            </MDBCardBody>
                                        </MDBCard>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow>
                                    <MDBCol style={{ marginTop: '1em', marginBottom: '6.5em', color: 'black', textAlign: 'center' }}>
                                        &copy; {new Date().getFullYear()} Copyright: <a href="https://www.myco.co.id" style={{ color: "black" }}> myco.co.id </a>
                                        <ul className="list-unstyled list-inline">
                                            {/* <li className="list-inline-item">
                                                <a className="btn-floating btn-sm btn-fb mx-1">
                                                    <i className="fab fa-facebook-f"> </i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a className="btn-floating btn-sm btn-tw mx-1">
                                                    <i className="fab fa-twitter"> </i>
                                                </a>
                                            </li> */}
                                            <li className="list-inline-item">
                                                <a className="btn-floating btn-sm btn-li mx-1" href="https://www.linkedin.com/in/myco-cpm-9b2884194/" style={{ color: "black" }}>
                                                    <i className="fab fa-linkedin-in"> </i>
                                                </a>
                                            </li>
                                            <li className="list-inline-item">
                                                <a className="btn-floating btn-sm btn-dribbble mx-1" href="https://www.instagram.com/suckitupboyy/" style={{ color: "black" }}>
                                                    <i className="fab fa-instagram"> </i>
                                                </a>
                                            </li>
                                        </ul>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCol>
                        </MDBRow>
                    </MDBContainer>
                </div>

            </Fragment>
        )
    }
}

export default Login;