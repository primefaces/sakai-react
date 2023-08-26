/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Toast } from "primereact/toast";
import { Column } from "primereact/column";
import {
  DataTable,
  DataTableSelectionChangeEvent,
  DataTableSelectEvent,
} from "primereact/datatable";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { confirmPopup, ConfirmPopup } from "primereact/confirmpopup";
import { ProductService } from "../../../../demo/service/ProductService";

import { Demo } from "../../../../types/types";
type ButtonEvent = React.MouseEventHandler<HTMLButtonElement>;
const OverlayDemo = () => {
  const [displayBasic, setDisplayBasic] = useState(false);
  const [displayConfirmation, setDisplayConfirmation] = useState(false);
  const [visibleLeft, setVisibleLeft] = useState(false);
  const [visibleRight, setVisibleRight] = useState(false);
  const [visibleTop, setVisibleTop] = useState(false);
  const [visibleBottom, setVisibleBottom] = useState(false);
  const [visibleFullScreen, setVisibleFullScreen] = useState(false);
  const [products, setProducts] = useState<Demo.Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Demo.Product | null>(
    null
  );
  const op = useRef<OverlayPanel>(null);
  const op2 = useRef<OverlayPanel>(null);
  const toast = useRef<Toast>(null);

  const accept = () => {
    toast.current?.show({
      severity: "info",
      summary: "Confirmed",
      detail: "You have accepted",
      life: 3000,
    });
  };

  const reject = () => {
    toast.current?.show({
      severity: "error",
      summary: "Rejected",
      detail: "You have rejected",
      life: 3000,
    });
  };

  const confirm: ButtonEvent = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Are you sure you want to proceed?",
      icon: "pi pi-exclamation-triangle",
      accept,
      reject,
    });
  };

  useEffect(() => {
    ProductService.getProductsSmall().then((data) => setProducts(data));
  }, []);

  const toggle: ButtonEvent = (event) => {
    op.current?.toggle(event);
  };

  const toggleDataTable: ButtonEvent = (event) => {
    op2.current?.toggle(event);
  };

  const formatCurrency = (value: number) => {
    return value?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const onProductSelect = (event: DataTableSelectEvent) => {
    op2.current?.hide();
    toast.current?.show({
      severity: "info",
      summary: "Product Selected",
      detail: event.data.name,
      life: 3000,
    });
  };

  const onSelectionChange = (
    e: DataTableSelectionChangeEvent<Demo.Product[]>
  ): void => {
    setSelectedProduct(e.value as Demo.Product);
  };

  const basicDialogFooter = (
    <Button
      type="button"
      label="OK"
      onClick={() => setDisplayBasic(false)}
      icon="pi pi-check"
      severity="secondary"
    />
  );
  const imageBodyTemplate = (data: Demo.Product) => (
    <img
      src={`/demo/images/product/${data.image}`}
      alt={data.image}
      className="product-image"
      width="60"
      style={{
        boxShadow:
          "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)",
      }}
    />
  );
  const priceBodyTemplate = (data: Demo.Product) =>
    formatCurrency(data.price ?? 0);
  const confirmationDialogFooter = (
    <>
      <Button
        type="button"
        label="No"
        icon="pi pi-times"
        onClick={() => setDisplayConfirmation(false)}
        text
      />
      <Button
        type="button"
        label="Yes"
        icon="pi pi-check"
        onClick={() => setDisplayConfirmation(false)}
        text
        autoFocus
      />
    </>
  );

  return (
    <>
      <Toast ref={toast} />
      <div className="grid">
        <div className="col-12 lg:col-6">
          <div className="card">
            <h5>Dialog</h5>
            <Dialog
              header="Dialog"
              visible={displayBasic}
              style={{ width: "30vw" }}
              modal
              footer={basicDialogFooter}
              onHide={() => setDisplayBasic(false)}
            >
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </Dialog>
            <div className="grid">
              <div className="col-12">
                <Button
                  type="button"
                  label="Show"
                  icon="pi pi-external-link"
                  onClick={() => setDisplayBasic(true)}
                />
              </div>
            </div>
          </div>
          <div className="card">
            <h5>Overlay Panel</h5>
            <div className="flex flex-wrap gap-2">
              <div>
                <Button
                  type="button"
                  label="Image"
                  onClick={toggle}
                  severity="success"
                />
                <OverlayPanel
                  ref={op}
                  appendTo={
                    typeof window !== "undefined" ? document.body : null
                  }
                  showCloseIcon
                >
                  <img src="/demo/images/nature/nature9.jpg" alt="nature1" />
                </OverlayPanel>
              </div>
              <div>
                <Button
                  type="button"
                  label="DataTable"
                  onClick={toggleDataTable}
                  severity="success"
                />
                <OverlayPanel
                  ref={op2}
                  appendTo={
                    typeof window !== "undefined" ? document.body : null
                  }
                  showCloseIcon
                  id="overlay_panel"
                  style={{ width: "450px" }}
                >
                  <DataTable
                    value={products}
                    selection={selectedProduct || undefined}
                    onSelectionChange={onSelectionChange}
                    selectionMode="single"
                    responsiveLayout="scroll"
                    paginator
                    rows={5}
                    onRowSelect={onProductSelect}
                  >
                    <Column
                      field="name"
                      header="Name"
                      sortable
                      headerStyle={{ minWidth: "10rem" }}
                    />
                    <Column
                      header="Image"
                      body={imageBodyTemplate}
                      headerStyle={{ minWidth: "10rem" }}
                    />
                    <Column
                      field="price"
                      header="Price"
                      body={priceBodyTemplate}
                      sortable
                      headerStyle={{ minWidth: "8rem" }}
                    />
                  </DataTable>
                </OverlayPanel>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 lg:col-6">
          <div className="card">
            <h5>Confirmation</h5>
            <Button
              label="Delete"
              icon="pi pi-trash"
              severity="danger"
              onClick={() => setDisplayConfirmation(true)}
            />
            <Dialog
              header="Confirmation"
              visible={displayConfirmation}
              onHide={() => setDisplayConfirmation(false)}
              style={{ width: "350px" }}
              modal
              footer={confirmationDialogFooter}
            >
              <div className="flex align-items-center justify-content-center">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                <span>Are you sure you want to proceed?</span>
              </div>
            </Dialog>
          </div>
          <div className="card">
            <h5>Sidebar</h5>
            <Sidebar
              visible={visibleLeft}
              onHide={() => setVisibleLeft(false)}
              baseZIndex={1000}
            >
              <h1 style={{ fontWeight: "normal" }}>Left Sidebar</h1>
            </Sidebar>

            <Sidebar
              visible={visibleRight}
              onHide={() => setVisibleRight(false)}
              baseZIndex={1000}
              position="right"
            >
              <h1 style={{ fontWeight: "normal" }}>Right Sidebar</h1>
            </Sidebar>

            <Sidebar
              visible={visibleTop}
              onHide={() => setVisibleTop(false)}
              baseZIndex={1000}
              position="top"
            >
              <h1 style={{ fontWeight: "normal" }}>Top Sidebar</h1>
            </Sidebar>

            <Sidebar
              visible={visibleBottom}
              onHide={() => setVisibleBottom(false)}
              baseZIndex={1000}
              position="bottom"
            >
              <h1 style={{ fontWeight: "normal" }}>Bottom Sidebar</h1>
            </Sidebar>

            <Sidebar
              visible={visibleFullScreen}
              onHide={() => setVisibleFullScreen(false)}
              baseZIndex={1000}
              fullScreen
            >
              <h1 style={{ fontWeight: "normal" }}>Full Screen</h1>
            </Sidebar>

            <Button
              type="button"
              icon="pi pi-arrow-right"
              severity="warning"
              onClick={() => setVisibleLeft(true)}
              style={{ marginRight: ".25em" }}
            />
            <Button
              type="button"
              icon="pi pi-arrow-left"
              severity="warning"
              onClick={() => setVisibleRight(true)}
              style={{ marginRight: ".25em" }}
            />
            <Button
              type="button"
              icon="pi pi-arrow-down"
              severity="warning"
              onClick={() => setVisibleTop(true)}
              style={{ marginRight: ".25em" }}
            />
            <Button
              type="button"
              icon="pi pi-arrow-up"
              severity="warning"
              onClick={() => setVisibleBottom(true)}
              style={{ marginRight: ".25em" }}
            />
            <Button
              type="button"
              icon="pi pi-external-link"
              severity="warning"
              onClick={() => setVisibleFullScreen(true)}
            />
          </div>
        </div>

        <div className="col-12 lg:col-6">
          <div className="card">
            <h5>Tooltip</h5>
            <div className="flex align-items-center gap-2">
              <span>
                <InputText
                  type="text"
                  placeholder="Username"
                  tooltip="Your username"
                />
              </span>

              <Button
                type="button"
                label="Save"
                icon="pi pi-check"
                tooltip="
<h1>Z</h1>
                Lorem Ipsum es simplemente el texto 
                - [ ]  dKe relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas   las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.
                "
              />
            </div>
          </div>
        </div>
        <div className="col-12 lg:col-6">
          <Toast ref={toast} />

          <div className="card">
            <h5>ConfirmPopup</h5>
            <ConfirmPopup />
            <Button
              onClick={confirm}
              icon="pi pi-check"
              label="Confirm"
            ></Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverlayDemo;
