import axios from 'axios';
import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import './IncomingMessageContainer.css';
import { AgGridReact } from 'ag-grid-react';
import moment from 'moment';
import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import Typography from '@material-ui/core/Typography';

class IncomingMessageContainer extends Component {
    constructor(props) {
        super(props);
        // const datetime = moment.unix(this.props.datetime).format('M/D/YYYY @h:m:s');
        this.state = {
            columnDefs: [
                {
                headerName: "Read",
                field: "read",
                cellClass: "cell-wrap-text",
                autoHeight: true,
                checkboxSelection: true,
                width: 60},
                {
                headerName: "Number",
                field: "number",
                cellClass: "cell-wrap-text",
                autoHeight: true,
                width: 130},
                {
                headerName: "Message",
                field: "message",
                cellClass: "cell-wrap-text",
                autoHeight: true,
                width: 850},
                {
                headerName: "Date & Time",
                valueGetter: moment.unix(this.props.datetime).format('M/D/YYYY @h:m:s'),
                cellClass: "cell-wrap-text",
                autoHeight: true,
                width: 150}
            ],
            rowData: this.props.messages,


            onGridReady: function(params) {
               let minRowHeight = 25;
               let currentRowHeight = minRowHeight;
                params.api.sizeColumnsToFit();
              },
              getRowHeight: function() {
                return currentRowHeight;
              }
            };
          }

          onGridReady(params) {
            this.gridApi = params.api;
            this.gridColumnApi = params.columnApi;

            minRowHeight = 25;
            currentRowHeight = minRowHeight;
            params.api.sizeColumnsToFit();
          }

          onGridSizeChanged(params) {
            const gridHeight = document.getElementsByClassName("ag-body")[0].offsetHeight;
            const renderedRows = params.api.getRenderedNodes();
            if (renderedRows.length * minRowHeight >= gridHeight) {
              if (currentRowHeight !== minRowHeight) {
                currentRowHeight = minRowHeight;
                params.api.resetRowHeights();
              }
            } else {
              currentRowHeight = Math.floor(gridHeight / renderedRows.length);
              params.api.resetRowHeights();
            }

        };



    render() {

        return (
            <div id="responsive-wrapper" className="container-center">
            <div
              className="ag-theme-balham"
              style={{
                height: '850px',
                width: '100%',

                }}
                >
                <AgGridReact
                    enableSorting={true}
                    enableColResize={true}
                    rowSelection="multiple"
                    columnDefs={this.state.columnDefs}
                    rowData={this.props.messages}
                    onGridReady={this.state.onGridReady}
                    getRowHeight={this.state.getRowHeight}
                    onGridReady={this.onGridReady.bind(this)}
                    onGridSizeChanged={this.onGridSizeChanged.bind(this)}

                />
            </div>

            </div>
        );


    }
}

let minRowHeight = 125;
let currentRowHeight = minRowHeight;

export default IncomingMessageContainer;