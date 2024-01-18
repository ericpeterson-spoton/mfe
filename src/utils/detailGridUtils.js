/**
 * File is presently UNUSED
 *   Here for reference in case nested tables are needed in the future
 */
import { currencyFormatter } from './formatUtils';

const getDetailGridOptions = () => ({
    masterDetail: true,
    detailRowHeight: 300,
    detailCellRendererParams: {
      detailGridOptions: getGuestDetailGridOptions(),
      getDetailRowData: (params) => {
        params.successCallback(params.data.guests);
      },
    },
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
      enableSorting:true
    },
    suppressAggFuncInHeader: true,
    columnDefs: [
        { 
            field: 'check_id', 
            headerName: 'Check ID' ,
            cellRenderer: 'agGroupCellRenderer',
        },
        
        { 
            field: 'void_total', 
            headerName: 'Void Total',
            valueFormatter:currencyFormatter
        },  
        { 
            field: 'surcharge_revenue', 
            headerName: 'Surcharge Revenue',
            valueFormatter:currencyFormatter
        }, 
        { 
            field: 'gratuity', 
            headerName: 'Gratuity',
            valueFormatter:currencyFormatter
        },
        { 
            field: 'refund_total', 
            headerName: 'Refund',
            valueFormatter:currencyFormatter
        }, 
        { 
            field: 'taxes', 
            headerName: 'Taxes',
            valueFormatter:currencyFormatter
        }, 
        { 
            field: 'subtotal', 
            headerName: 'Subtotal',
            valueFormatter:currencyFormatter
        }, 
        
        { 
            field: 'total', 
            headerName: 'Total',
            valueFormatter:currencyFormatter
        }
    ], // Define columns for guests
    // More configuration for the detail grid...
  });

  const  getGuestDetailGridOptions = () => ({
    masterDetail: true,
    detailRowHeight: 500,
    detailCellRendererParams: {
      detailGridOptions: getItemDetailGridOptions(),
      getDetailRowData: (params) => {
        params.successCallback(params.data.items);
      },
    },
    defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
        enableSorting:true
    },
    columnDefs: [
        // { 
        //     field: 'guest_id', 
        //     headerName: 'Guest ID'
        // }, 
        { 
            field: 'guest_name', 
            headerName: 'Guest Name',
            cellRenderer: 'agGroupCellRenderer',
        },
        { 
            field: 'void_total', 
            headerName: 'Void Total',
            valueFormatter:currencyFormatter
        },  
        { 
            field: 'surcharge_revenue', 
            headerName: 'Surcharge Revenue',
            valueFormatter:currencyFormatter
        }, 
        { 
            field: 'gratuity', 
            headerName: 'Gratuity',
            valueFormatter:currencyFormatter
        },
        { 
            field: 'refund_total', 
            headerName: 'Refund',
            valueFormatter:currencyFormatter
        }, 
        { 
            field: 'taxes', 
            headerName: 'Taxes',
            valueFormatter:currencyFormatter
        }, 
        { 
            field: 'subtotal', 
            headerName: 'Subtotal',
            valueFormatter:currencyFormatter
        }, 
        
        { 
            field: 'total', 
            headerName: 'Total',
            valueFormatter:currencyFormatter
        }
    ],
  })

  const getItemDetailGridOptions = () =>({
    defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
        enableSorting:true
    },
    columnDefs: getItemDetailColumnDefs()
  });

  const getItemDetailColumnDefs = () => [
    { field: 'surcharge_revenue', headerName: 'Surcharge Revenue', valueFormatter: currencyFormatter },
    { field: 'gratuity', headerName: 'Gratuity', valueFormatter: currencyFormatter },
    { field: 'refund_total', headerName: 'Refund', valueFormatter: currencyFormatter },
    { field: 'taxes', headerName: 'Taxes', valueFormatter: currencyFormatter },
    { field: 'subtotal', headerName: 'Subtotal', valueFormatter: currencyFormatter },
    { field: 'total', headerName: 'Total', valueFormatter: currencyFormatter }
];