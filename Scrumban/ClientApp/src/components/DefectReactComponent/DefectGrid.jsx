﻿import React from 'react';
import { DefectRow } from './DefectRow';
import { DefectFilter } from './DefectFilter';
import { Pagination } from './Pagination';
import { checkToken } from '../Helpers';
import { toast } from 'react-toastify';
import '../../GridStyles/StyleForGrid.css';

const apiGetUrl = "/api/Defect/getDefects";
const apiDeleteUrl = "/api/Defect/deleteDefect";

export class DefectGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            defects: [],
            pageOfItems: [],

            //sorting
            currentSort:
            {
                columnName: '',
                sortingOrder: ''
            }
        };
        this.loadData = this.loadData.bind(this);
        this.onChanged = this.onChanged.bind(this);
        this.onRemoveDefect = this.onRemoveDefect.bind(this);

        //sorting
        this.sortData = this.sortData.bind(this)  

        //pagination
        this.onChangePage = this.onChangePage.bind(this);
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({
            pageOfItems: pageOfItems
        });
       
    }

    //sorting
    sortData(columnName) {
        let currentSort = this.state.currentSort

        var query = '?$orderby='

        if (currentSort.columnName == columnName) {
            if (currentSort.sortingOrder == 'asc') {
                currentSort.sortingOrder = 'desc'
            }
            else {
                currentSort.sortingOrder = 'asc'
            }
        }
        else {
            currentSort.columnName = columnName
            currentSort.sortingOrder = 'asc'
        }

        this.setState({ currentSort: currentSort })

        switch (columnName) {
            case 'name':
                query += 'name' + ' ' + this.state.currentSort.sortingOrder;
                break
            case 'description':
                query += 'description' + ' ' + this.state.currentSort.sortingOrder;
                break
            case 'state':
                query += 'state' + ' ' + this.state.currentSort.sortingOrder;
                break
            case 'priority':
                query += 'priority' + ' ' + this.state.currentSort.sortingOrder;
                break
            case 'severity':
                query += 'severity' + ' ' + this.state.currentSort.sortingOrder;
                break
            case 'storyId':
                query += 'storyId' + ' ' + this.state.currentSort.sortingOrder;
                break
            case 'status':
                query += 'status' + ' ' + this.state.currentSort.sortingOrder;
                break
        }
        this.loadData(query);
    }

    renderCaret(columnName) {
        if (this.state.currentSort.columnName == columnName) {
            if (this.state.currentSort.sortingOrder == 'asc') {
                return (<span class="fa fa-caret-up" id="active-caret" ></span>)
            }
            else {
                return (<span class="fa fa-caret-down" id="active-caret" ></span>)
            }
        }
        else {
            return (<span class="fa fa-caret-down"></span>)
        }
    }

    onChanged(item) {
        var arr = this.state.defects;
        var index = arr.indexOf(x => x.defectId === item.defectId);
        console.log(index);
        arr[index] = item;
        console.log(arr[index]);
        console.log(arr);
        this.setState({ defects: arr });
    }

    componentDidMount() {
        this.loadData("");
    }

    loadData(query) {
        checkToken()
        fetch(apiGetUrl + query, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                'Authorization': 'Bearer ' + sessionStorage.getItem("tokenKey")
            }
        })
            .then(function (response) {
                let responseStatus = response.status
                switch (responseStatus) {
                    case 200:
                        return response.json()
                        break
                    case 401:
                        toast.warn("You are not authorized. Please login!");
                        window.location.replace("");
                        break
                    case 403:
                        toast.error("You have not permission  !");
                        break
                    default:
                        toast.error("Something wrong  !");
                        break
                }
            })
            .then(data => { this.setState({ defects: data }) });
       
    }

    onRemoveDefect(defectId) {
        checkToken()
        var url = apiDeleteUrl + "/" + defectId;
        fetch(url, {
            method: "delete",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem("tokenKey")
            }
        })
            .then(function (response) {
                let responseStatus = response.status
                switch (responseStatus) {
                    case 200:
                        toast.success("Defect was deleted !");
                        this.loadData("");
                        break
                    case 401:
                        toast.warn("You are not authorized. Please login!");
                        window.location.replace("");
                        break
                    case 403:
                        toast.error("ERROR! You have not permission !");
                        break
                    case 404:
                        toast.error("Incorrect Email or Token!");
                        break
                    default:
                        toast.error("Something wrong!!");
                        this.loadData("");
                        break
                }
            }.bind(this))
    }

    render() {
        var changed = this.onChanged;
        var remove = this.onRemoveDefect;

        return (<div >
            <label style={{ 'fontSize': '40px','margin-left':'1%' }}> Defects </label>

            <DefectFilter loadData={this.loadData} />

            {/* Table*/}
            <div className="tablePosition" style={{ 'margin-right': '1%', 'margin-left': '1%' }}>
                <table class="table table-hover" style={{ 'table-layout': 'fixed' }} >
                    <thead>
                    <tr>
                            <th className="col" style={{ cursor: 'pointer' }} onClick={() => this.sortData('name')}> Name {this.renderCaret('name')}</th>
                            <th className="col" style={{ cursor: 'pointer' }} onClick={() => this.sortData('description')}> Description {this.renderCaret('description')}</th>
                            <th className="col" style={{ cursor: 'pointer' }} onClick={() => this.sortData('state')}> State {this.renderCaret('state')}</th>
                            <th className="col" style={{ cursor: 'pointer' }} onClick={() => this.sortData('priority')}> Priority {this.renderCaret('priority')}</th>
                            <th className="col" style={{ cursor: 'pointer' }} onClick={() => this.sortData('severity')}> Severity {this.renderCaret('severity')}</th>
                            <th className="col" style={{ cursor: 'pointer' }} onClick={() => this.sortData('storyId')}> StoryId {this.renderCaret('storyId')}</th>
                            <th className="col" style={{ cursor: 'pointer' }} onClick={() => this.sortData('status')}> Status {this.renderCaret('status')}</th>
                            <th class="col" />
                    </tr>

                </thead>



                {(this.state.pageOfItems.length > 0)//pageOfItems
                    ? this.state.pageOfItems.map((defect) => {//pageOfItems
                       
                            return <DefectRow key={defect.defectId} defect={defect} onRemove={remove} onChanged={changed} loadData={this.loadData} />
                        })
                    : (<tbody>
                            <td>
                                No results
                            </td>
                       </tbody>)
                }
                </table>
                </div>
            <div>
                <Pagination items={this.state.defects}  onChangePage={this.onChangePage} />
            </div>
            <button class="btn btn-sm btn-outline-dark" onClick={() => this.props.moveToComponent("defectAdd")}>Add defect</button>
        </div>
        )
    }
}
