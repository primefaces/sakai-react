import React, { Component, Fragment, useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
// import { Rating } from 'primereact/rating';
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { UserService } from "../../service/UserService";
import authErrorResponse from "../../utils/AuthErrorResponse";
import Cookies from "js-cookie";

class User extends Component {
    constructor(props) {
        super(props);
        this.UserService = new UserService();
    }
    state = {
        dataAPI: [],
        displayDialog: false,
        user: {
            username: '',
            password: '',
            email: '',
            role: '',
        },
        selectedUser: {
            username: "",
            password: "",
            email: "",
            role: "",
        },
        globalFilter: "",
        setGlobalFilter: "",
    };

    getUser = async () => {
        let user = await this.UserService.getUser()
        console.log("data user", user)
        if (user.status) {
            let error = authErrorResponse(user)
            this.growl.show(error)
        } else {
            this.setState({ dataAPI: await user.data })
        }
    }

    async componentDidMount() {
        // const cookie = Cookies.get("user");
        // if (cookie) {
        //     await this.getUser();
        //     console.log("data from service : ", this.getUser());
        // }
        await this.getUser();
    }

    

    render() {
        const actionBodyTemplate = (rowData) => {
            return (
                <div className="actions">
                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2"  />
                    <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2"  />
                </div>
            );
        };
        // let toast = useRef(null);

        const header = (
            <Fragment>
                <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5 className="m-0">Manage User</h5>
                    <span className="block mt-2 md:mt-0 p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText type="search" onInput={(e) => this.setState.setGlobalFilter(e.target.value)} placeholder="Search..." />
                    </span>
                </div>
            </Fragment>
        );

        return (
            <Fragment>
                <div className="grid crud-demo">
                    <div className="col-12">
                        <div className="card">
                        <Toast ref={(el)=> this.toast = el} />
                            {/* <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar> */}

                            <DataTable
                                value={this.state.dataAPI}
                                selection={this.state.selectedUser}
                                // onSelectionChange={(e) => this.setState({ selectedUrl: e.value })}
                                dataKey="id"
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25]}
                                className="datatable-responsive"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                                globalFilter={this.state.globalFilter}
                                emptyMessage="No products found."
                                header={header}
                                responsiveLayout="scroll"
                            >
                                <Column field="username" header="Username" headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                {/* <Column field="password" header="Password" headerStyle={{ width: "14%", minWidth: "10rem" }}></Column> */}
                                <Column field="email" header="Email" headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                {/* <Column header="Image" body={imageBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                            <Column field="price" header="Price" body={priceBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '8rem' }}></Column>
                            <Column field="category" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                            <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '10rem' }}></Column> */}
                                <Column field="role" header="Role" headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                                <Column header="Action" body={actionBodyTemplate}></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default User;
