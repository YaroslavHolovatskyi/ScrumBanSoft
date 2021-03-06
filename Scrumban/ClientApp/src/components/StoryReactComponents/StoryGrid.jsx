﻿import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { StoryComponent } from './StoryComponent';
import { StoryFilter } from './StoryFilter';
import { toast } from 'react-toastify';
import '../../GridStyles/StyleForGrid.css';

// const
const icon_up = require("../FeatureReactComponents/sort-arrow-up.svg")
const icon_down = require("../FeatureReactComponents/sort-arrow-down.svg")




export class StoryGrid extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stories: [],
            sortByName: icon_up,
            sortByDescription: icon_up,
            sortByStoryPoints: icon_up,
            sortByRank: icon_up,
            sortByState: icon_up,
            currentSort:
            {
                columnName: '',
                sortingOrder: ''
            }
        };

        this.onRemoveStory = this.onRemoveStory.bind(this);
        this.onChanged = this.onChanged.bind(this);
        this.loadData = this.loadData.bind(this);
        this.fetchSprints = this.fetchSprints.bind(this);
        this.renderCaret = this.renderCaret.bind(this);
        this.onDeleteItem = this.onDeleteItem.bind(this);
        this.sortData = this.sortData.bind(this);
        this.startFiltration = this.startFiltration.bind(this);
        //this.sortByName = this.sortByName.bind(this);
    }

    onDeleteItem(id) {
        var newStory = this.state.stories.filter(function (x) {
            return x.story_id != id;
        });
        this.setState({ stories: newStory });
        toast.success("You deleted a story!");
        this.loadData("");
    }

    fetchSprints() {

        fetch("/api/sprint/index")

            .then(response => response.json())

            .then(data => {

                this.setState({ sprints: data })

            });

    }

    onChanged(item) {
        var arr = this.state.stories;
        var index = arr.indexOf(x => x.id = item.id);
        arr[index] = item;
        toast.success("You edited a story!");
        this.setState({ stories: arr });
    }

    onRemoveStory(id) {

        fetch('/api/Story/' + id, {
            method: "delete",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(function (response) {
            if (response.status == 200) {
                //this.loadData();
                this.onDeleteItem(id);
            }
            else if (response.status == 401) {
                var answer = window.confirm("You are not authorized. Move to Login page ?")
                if (answer == true) {
                    window.location.replace("/login");
                }
            }
            else if (response.status == 403) {
                alert("ERROR! You have not permission !")
            }
            else {
                alert("ERROR! Status code: " + response.status)
            }
        }.bind(this));
    }
    renderCaret(columnName) {
        if (this.state.currentSort.columnName == columnName) {
            if (this.state.currentSort.sortingOrder == 'asc') {
                return (<span class="fa fa-caret-up" id="active-caret" style={{ color: '#2adc29' }} />)
            }
            else {
                return (<span class="fa fa-caret-down" id="active-caret" style={{ color: '#2adc29' }} />)
            }
        }
        else {
            return (<span class="fa fa-caret-down"></span>)
        }
    }
    sortData(columnName){
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
                if (this.state.currentSort.sortingOrder == 'asc') {
                    this.setState({ sortByName: icon_up });
                }
                else {
                    this.setState({ sortByName: icon_down });
                }
                break
            case 'description':
                query += 'description' + ' ' + this.state.currentSort.sortingOrder;
                if (this.state.currentSort.sortingOrder == 'asc') {
                    this.setState({ sortByDescription: icon_up });
                }
                else {
                    this.setState({ sortByDescription: icon_down });
                }
                break
            case 'story_points':
                query += 'storyPoints' + ' ' + this.state.currentSort.sortingOrder;
                if (this.state.currentSort.sortingOrder == 'asc') {
                    this.setState({ sortBySDate: icon_up });
                }
                else {
                    this.setState({ sortBySDate: icon_down });
                }
                break

            case 'rank':
                query += 'rank' + ' ' + this.state.currentSort.sortingOrder;
                if (this.state.currentSort.sortingOrder == 'asc') {
                    this.setState({ sortByPriority: icon_up });
                }
                else {
                    this.setState({ sortByPriority: icon_down });
                }
                break
            case 'state':
                query += 'storyState' + ' ' + this.state.currentSort.sortingOrder;
                if (this.state.currentSort.sortingOrder == 'asc') {
                    this.setState({ sortByState: icon_up });
                }
                else {
                    this.setState({ sortByState: icon_down });
                }
                break
        }

        this.loadData(query);
    }

    componentDidMount() {
        this.loadData("")
    }
    loadData(query) {
        fetch('api/Story/GetStories' + query, {
            method: "get",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(function (response) {
            if (response.status == 200) {
                return response.json()
            }
            else if (response.status == 401) {
                var answer = window.confirm("You are not authorized. Move to Login page ?");
                if (answer == true) {
                    window.location.replace("/login");
                }
            }
            else if (response.status == 403) {
                alert("ERROR! You have not permission !")
            }
            else {
                alert("ERROR! Status code: " + response.status)
            }
        }).then(data =>
                this.setState({ stories: data })
            );
    }
    startFiltration(filtrParam) {

        this.loadData(filtrParam);

    }


    render() {
        var remove = this.onRemoveStory;
        var changed = this.onChanged;
        return (<div>
            <label style={{ 'fontSize': '40px' }}>Stories</label>
            <br />
            <hr></hr>
            <StoryFilter changeFilter={this.startFiltration} />
            <hr></hr>
            <div className="tablePosition">
                <table class="table table-striped" style={{ 'table-layout': 'fixed' }}>
                    <thead>
                        <th className="col" style={{ cursor: 'pointer' }} onClick={() => this.sortData('name')}>Name{this.renderCaret('name')}</th>
                        <th className="col" style={{ cursor: 'pointer' }} onClick={() => this.sortData('state')}>State{this.renderCaret('state')}</th>
                        <th className="col" style={{ cursor: 'pointer' }} onClick={() => this.sortData('description')}>Description{this.renderCaret('description')}</th>
                        <th className="col" style={{ cursor: 'pointer' }} onClick={() => this.sortData('story_points')}>Story points{this.renderCaret('story_points')}</th>
                        <th className="col" style={{ cursor: 'pointer' }} onClick={() => this.sortData('rank')}>Rank{this.renderCaret('rank')}</th>
                        <th class="col"  />
                        <th class="col" />
                    </thead>
                    {this.state.stories.map(function (story) { return <StoryComponent key={story.story_id} story={story}  onRemove={remove} onChanged={changed} /> })}
                </table>
                <button class="btn btn-sm btn-outline-dark" style={{ 'margin': '20px' }} onClick={() => this.props.moveToComponent("storyAdd")}>Create New</button>
            </div>
        </div>
        );
    }
}