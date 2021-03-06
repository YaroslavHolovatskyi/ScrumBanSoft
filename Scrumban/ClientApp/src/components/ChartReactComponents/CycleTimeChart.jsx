﻿import React from "react";
import { Bar } from "react-chartjs-2";
import  './css/CycleTimeChart.css'

//constant values
const NOT_SELECTED = "Select sprint here...";

/*=====Function for forming OX labels=====*/
function getStoriesNames(stories) {
    var namesArray = [];
    for (var i = 0; i < stories.length; i++) {
        namesArray.push(stories[i].name);
    }
    return namesArray;
}
/*=====Function for calculating duration of story=====*/
function getDurationOfStory(startDate, endDate) {
    var startDay = Number(startDate.substring(8, 10));
    var endDay = Number(endDate.substring(8, 10));
    var startMonth = Number(startDate.substring(5, 7));
    var endMonth = Number(endDate.substring(5, 7));
    var year = Number(startDate.substring(0, 4));
    var duration;
    if (startMonth == endMonth) {
        duration = endDay - startDay + 1;
        return duration;
    } else {
        switch (startMonth) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                duration = (31 - startDay) + endDay + 1;
                break;
            case 4:
            case 6:
            case 9:
            case 11:
                duration = (30 - startDay) + endDay + 1;
                break;
            case 2:
                if ((year % 4) === 0) {
                    duration = (29 - startDay) + endDay + 1;
                } else {
                    duration = (28 - startDay) + endDay + 1;
                }
        }
        return duration;
    }
}
/*=====Function for calculating cycle time days=====*/
function GetCycleTimeDays(stories) {
    var resaultArray = [];
    for (var i = 0; i < stories.length; i++) {
        if (stories[i].startDate && stories[i].endDate) {
            var duration = getDurationOfStory(stories[i].startDate, stories[i].endDate);
            resaultArray.push(duration);
        }
        else {
            resaultArray.push(0);
        }
    }
    return resaultArray;
}
/*=====Function getting random color=====*/
function getRandomColorHex() {
    var hex = "0123456789ABCDEF",
        color = "#";
    for (var i = 1; i <= 6; i++) {
      color += hex[Math.floor(Math.random() * 16)];
    }
    return color;
  }

export class CycleTimeChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            allSprints: [],
            storiesOfSelectedSprint: [],
            storyNames: [],
            cycleTimeDays: [],
            maxCycleTime: 30
        };
        this.onSprintChanged = this.onSprintChanged.bind(this);
    }
    componentDidMount() {

        fetch('api/Sprint/Index')
            .then(res => res.json())
            .then(json => {
                this.setState({ allSprints: json })
            });
    }
    onSprintChanged = async (e) => {
        if (e.target.value != NOT_SELECTED) {
            var selectedSprint = this.state.allSprints.find(x => x.name === e.target.value);
            var sprint_id = selectedSprint.sprint_id;
            ///get all stories
            var responce = await fetch('api/Chart/GetSprintStories/' + sprint_id);
            var stories = await responce.json();
            var storiesNames = getStoriesNames(stories);
            ///get cicle time days
            var cycleTimeDays = GetCycleTimeDays(stories);
            var maxValue = Math.max.apply(null, cycleTimeDays);
            this.setState({
                storiesOfSelectedSprint: stories,
                storyNames: storiesNames,
                cycleTimeDays: cycleTimeDays,
                maxCycleTime: maxValue
            });
        }

    }
    render() {
        const dataCycleTime = {
            labels: this.state.storyNames,
            datasets: [
                {
                    label: "Days",
                    data: this.state.cycleTimeDays,
                    borderWidth: 1,
                    backgroundColor:
                        getRandomColorHex(),
                }
            ]
        }
        const optionsCycleTime = {
            scales: {
                yAxes: [{
                    ticks: {
                        max: this.state.maxCycleTime,
                        min: 0,
                        stepSize: 5
                    },
                    gridLines: {
                        color: "black",
                        borderDash: [2, 5],
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Cycle Time Days",
                        fontColor: "green"
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Stories",
                        fontColor: "green"
                    }
                }
                ]
            },
        }
        return (
            <div className='container'>
                <div className='centered'>
                    <select className="btn btn-light dropdown-toggle" name="sprints" onChange={e => this.onSprintChanged(e)}>
                        <option>{NOT_SELECTED}</option>
                    {this.state.allSprints.map(sprint => (
                        <option> {sprint.name}</option>))}
                </select>
                <h3 className='header'>Cycle Time</h3>
                <Bar data={dataCycleTime} options={optionsCycleTime} />
                </div>
            </div>
            );
    }
}