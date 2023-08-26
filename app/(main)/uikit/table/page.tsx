"use client"
import React, { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import {
  DataTable,
  DataTableExpandedRows,
  DataTableFilterMeta,
} from "primereact/datatable";
import {
  Column,
} from "primereact/column";
import { Button } from "primereact/button";
import { CustomerService } from "../../../../demo/service/CustomerService";
import { ProductService } from "../../../../demo/service/ProductService";

import { InputText } from "primereact/inputtext";
import { Demo } from "../../../../types/types";

const TableDemo = () => {
  const [customers1, setCustomers1] = useState<Demo.Customer[]>([]);
  const [customers2, setCustomers2] = useState<Demo.Customer[]>([]);
  const [customers3, setCustomers3] = useState<Demo.Customer[]>([]);
  const [filters1, setFilters1] = useState<DataTableFilterMeta>({});
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [idFrozen, setIdFrozen] = useState(false);
  const [products, setProducts] = useState<Demo.Product[]>([]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [expandedRows, setExpandedRows] = useState<
    any[] | DataTableExpandedRows
  >([]);

  interface Represenative {
    name: string;
    image: string;
  }

  useEffect(() => {
    console.log(products)
  }, [products])


  const clearFilter1 = () => {
    initFilters1();
  };

  const onGlobalFilterChange1: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    let _filters1 = { ...filters1 };
    (_filters1["global"] as any).value = value;

    const value = e.target.value;
    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  const renderHeader1 = () => {
    return (
      <div className="flex justify-content-between">
        <Button
          type="button"
          icon="pi pi-filter-slash"
          label="Clear"
          outlined
          onClick={clearFilter1}
        />
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  useEffect(() => {
    setLoading2(true);

    CustomerService.getCustomersLarge().then((data) => {
      setCustomers1(getCustomers(data));
      setLoading1(false);
    });
    CustomerService.getCustomersLarge().then((data) => {
      setCustomers2(getCustomers(data));
      setLoading2(false);
    });
    CustomerService.getCustomersMedium().then((data) => setCustomers3(data));
    ProductService.getProductsWithOrdersSmall().then((data) =>
      setProducts(data)
    );

    initFilters1();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps



  const getCustomers = (data: Demo.Customer[]) => {
    return [...(data || [])].map((d) => {
      d.date = new Date(d.date);
      return d;
    });
  };



  const formatCurrency = (value: number) => {
    return value?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      "country.name": {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
      },
      balance: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      status: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
      verified: { value: null, matchMode: FilterMatchMode.EQUALS },
    });
    setGlobalFilterValue1("");
  };



  const imageBodyTemplate = (rowData: Demo.Product) => {
    return (
      <img
        src={`/demo/images/product/${rowData.image}`}
        onError={(e) =>
        (e.currentTarget.src =
          "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
        }
        alt={rowData.image}
        className="shadow-2"
        width={100}
      />
    );
  };

  const priceBodyTemplate = (rowData: Demo.Product) => {
    return "50%"
  };



  function watchButton(e: any) {
    return (
      <button onClick={() => console.log(e)}>Watch</button>
    )
  }

  function prioritizeButton(e: any) {
    return (
      <button onClick={() => console.log(e)}>Prioritizar</button>
    )

  }

  const rowExpansionTemplate = (data: Demo.Product) => {
    console.log(data)
    return (
      <div className="orders-subtable">
        <DataTable value={data.orders} >
          <Column field="" header="Accion" body={watchButton}></Column>
          <Column header="Image" body={imageBodyTemplate} />
          <Column field="productCode" header="Tarea" ></Column>
          <Column field="productCode" header="Objetivo" ></Column>
          <Column field="status" header="Realizado?" ></Column>
        </DataTable>
      </div>
    );
  };

  const tareasCompuestas = () => {
    return (
      <DataTable
        value={products}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        dataKey="id"
        rowExpansionTemplate={rowExpansionTemplate}

      >
        <Column expander style={{ width: "3em" }} />
        <Column field="name" header="Tareas compuestas" />
        <Column
          field="Progreso"
          header="Progreso"

          body={priceBodyTemplate}
        />

      </DataTable>
    )
  }



  return (
    <div className="grid">
      <div className="col-12">

        <div className="card">
          <DataTable
            value={products}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={tareasCompuestas}
            dataKey="id"
          >

            <Column expander style={{ width: "3em" }} />
            <Column field="name" header="Metas" />
            <Column
              field="price"
              header="Tu Progreso"
              body={priceBodyTemplate}
            />
            <Column header="Accion"  body={prioritizeButton}></Column>

          </DataTable>
        </div>
      </div>

      <div className="col-12">
        <div className="card"></div>
      </div>
    </div>
  );
};

export default TableDemo;
