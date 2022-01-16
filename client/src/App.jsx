import React, { Component } from 'react';
import Pcacolumns from './components/Pcacolumns';
import { format } from 'react-string-format';


export default class App extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);

        this.state = {
            markers: [],
            pcaList: [],
            patientC: [],
            numberOfRows: 1,
            selectedIndex: 1,
            selectedMarker: 'meanradius',
            patientMarkerValue: '????'
        };
    }

    componentDidMount() {
        this._isMounted = true;

        if (this._isMounted) {
            this.getPCAColumns();
        }


        if (this._isMounted) {
            this.getPCAarray();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    //Get xy data in PCA format
    async getPCAarray() {
        await fetch('http://127.0.0.1:8000/rest/pcaxy'
        ).then(res => res.json())
            .then((data) => {
                if (this._isMounted) {
                    this.setState({ pcaList: data })
                    this.setState({ numberOfRows: this.state.pcaList.length })
                }
            })

        //Get target. If patient is Malignant or Benign
        await fetch('http:///localhost:8000/rest/patientclass'
        ).then(res => res.json())
            .then((data) => {
                this.setState({ patientC: data })
            })

        //Setup plot
        if (this._isMounted) {
            this.clickPCAPlot();
        }
    }

    //Get all different type of markers
    getPCAColumns = async () => {
        await fetch('http://localhost:8000/rest/pcacolumns'
        ).then(res => res.json())
            .then((data) => {
                data.map(entry => {
                    var l = Object.keys(entry)
                    //Remove first item since it is index column
                    this.setState({ markers: l.slice(1) })
                });
            })
    }

    //Creat plot with click handle
    clickPCAPlot = () => {
        var myPlot = document.getElementById('clickPCAPlot');
        var kx = []
        var ky = []
        var kid = []
        var pCV = []
        var i = 1

        //Get array with patien markers
        pCV = this.state.patientC.map((list) => {
            return (
                list.target
            )
        })

        //Setup local object for printing
        for (let userObject of this.state.pcaList) {
            kx.push(userObject[0]);
            ky.push(userObject[1]);
            kid.push(i);
            i++
        }

        //blue and red color
        const colorScaleVal = [
            ['0', 'rgb(0,0,255)'],
            ['1', 'rgb(255,0,0)']
        ]


        var data = [{
            x: kx, y: ky, text: kid, type: 'scatter',
            mode: 'markers', textposition: 'top', marker: {
                size: 10, cmin: 0,
                cmax: 1, color: pCV, colorscale: colorScaleVal
            }
        }]

        var layout = {
            autosize: false,
            width: 1000,
            height: 1000,
            margin: {
                l: 50,
                r: 50,
                b: 100,
                t: 100,
                pad: 4
            },
        };

        Plotly.newPlot('clickPCAPlot', data, layout);

        var pts = '';

        //Get context
        var localThis = this
        myPlot.on('plotly_click', function (data) {
            for (var i = 0; i < data.points.length; i++) {
                pts = 'id = ' + data.points[i].text + '\n' +
                    'x = ' + data.points[i].x + '\ny = ' +
                    data.points[i].y.toPrecision(4) + '\n\n';
                localThis.setState({ selectedIndex: parseInt(data.points[i].text) });
            }
            console.log('Closest point clicked:\n\n', pts);
            localThis.getMarker(localThis.state.selectedIndex, localThis.state.selectedMarker)
        })
    }

    //Callback for marker
    markerCallback = (marker) => {
        this.setState({ selectedMarker: marker })
        if (this._isMounted) {
            this.getMarker(this.state.selectedIndex, marker)
        }
    }

    //Get value for selected marker from server
    getMarker = async (aid, amarker) => {
        await fetch(format('http://localhost:8000/rest/patientdata/{0}/{1}', aid, amarker)
        ).then(res => res.text())
            .then((data) => {
                this.setState({ patientMarkerValue: data });
            })
    }

    render = () =>
        <div>
            <p></p>
            <Pcacolumns markerData={this.state.markers} markerCallback={this.markerCallback}></Pcacolumns>

            {/* <h1>{this.state.selectedMarker}</h1> */}

            <h1>{this.state.patientMarkerValue}</h1>

            <p>Selected index {this.state.selectedIndex}</p>
            <p>Total number of items = {this.state.numberOfRows}</p>

            <div id='clickPCAPlot'></div>
            {/* <div>
                {this.state.patientC.map((list) => {
                    return(
                            <h1>{list.target}</h1>                       
                        )
                })}                
            </div>                          */}

        </div>

}



