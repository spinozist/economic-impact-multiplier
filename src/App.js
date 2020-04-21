import React, { useState, useEffect } from "react";
import { Dropdown, Input } from 'semantic-ui-react';
import numeral from 'numeral';
import BubbleChart from './components/BubbleChart';
import Loader from 'react-loader-spinner';
import { Slider } from 'react-semantic-ui-range';

// import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import './App.css'


const App = () => {
    const [input, setInput] = useState();
    const [dropdownOptions, setDropdownOptions] = useState();
    const [selectedOption, setSelectedOption] = useState();
    const [selectedTab, setSelectedTab] = useState('Employment');
    const [showBubbles, setShowBubbles] = useState(false);

    const dataSource = 'JobsEQ Labor Insight, 2019Q3'

    const data = require('./data/ImpactedJobXers.json');
    const options = data.map(item => ({
        text: item['Industry'],
        key: item['UID'],
        value: item['UID']
    }));

    const rows = ['Direct', 'Indirect', 'Induced', 'Total'];
    const tabs = ['Employment', 'Compensation', 'Sales'];
    

    const DataLoader = () => 
        <Loader
            type="Grid"
            color="lightgrey"
            height={25}
            width={25}
        />


    const selectedIndustryInfo = selectedOption ? 
        data.find(item => item.UID === selectedOption) 
        : null;

    const rippleEffectData = require('./data/RippleEffect.json').filter(item =>
            selectedIndustryInfo ?
                item.Industry === selectedIndustryInfo.Industry
                : false
        );
    
    const bubbleData = rippleEffectData ?
        rippleEffectData.map((item, i) => ({
            _id: `ind${i}`,
            value: item.Ratio,
            index: i,
            displayText: item['Impacted Industry'],
            selected: false
        })) : null
    
    // console.log(bubbleData);

    const [percentLoss, setPercentLoss] = useState(.05);

    const sliderSettings = {
        start: percentLoss,
        min: .01,
        max: 1,
        step: .01,
        onChange: value =>  {
            setPercentLoss(value);
            setInput(selectedIndustryInfo ? 
            selectedIndustryInfo['Jobs 2019Q3'] * value * -1 : null)
        },
    };

    useEffect(() => setDropdownOptions(options), [])
    useEffect(() => setInput(selectedIndustryInfo ? 
        selectedIndustryInfo['Jobs 2019Q3'] * percentLoss * -1 : null), [selectedOption])

    return (
        <div id='main-wrapper'>
            <div id='title-wrapper'>
                <h1 id='title'>
                   <strong>COVID-19</strong><br />Economic Impact Calculator 
                </h1>
                <h3 id='subtitle'>
                    for the Atlanta Metro Region<sup>*</sup></h3>
            </div>
            <div id='industry-selector-wrapper'>

                <Dropdown
                    // focus
                    selection
                    // search
                    placeholder='Select an industry'
                    value={selectedOption}
                    options={dropdownOptions}
                    onChange={(e, data) => setSelectedOption(data.value)}
                />
            </div>
            {
                selectedIndustryInfo ?

                <div id='input-wrapper'>

                    {/* <p>
                        Loss of {input ? numeral(input).format('0,0') : null} ({numeral(percentLoss).format('0%')}) of {selectedIndustryInfo['Jobs 2019Q3']} total jobs
                    </p> */}
                    <h2 id='job-loss-label'>
                        {numeral(percentLoss).format('0%')}
                    </h2>
                    <small>Job Loss</small>
                        
                    <Slider 
                        style={{ margin: '10px 0 0 0',float: 'center', width: '100%' }}
                        // value={input}
                        settings={sliderSettings}
                        color='red'            
                    />

                {/* <Input
                    focus
                    text
                    placeholder='Enter expected job loss'
                    value={input ? numeral(input).format('0,0') : null}
                    onChange={(e, data) => setInput(data.value)}
                /> */}
                </div> : null
            }



            <div id='tab-row'>
                {
                    tabs.map(tab => 
                        <div 
                            // id={tab === selectedTab ? 'selected-tab' : null}
                            style={
                                tab === selectedTab ? 
                                    {
                                        fontWeight: '600',
                                        backgroundColor: 'aquamarine',
                                        // borderBottom: 'none',
                                        opacity: '1'
                                    } 
                                : null
                            }
                            onClick={() => {
                                setSelectedTab(tab)
                                setShowBubbles(false)
                            }}
                        >
                            {tab}
                        </div>
                    )
                }
            </div>

            <div id='main-grid'>
                <div className='grid-column'>
                    {
                        rows.map(row =>
                            <div className='grid-cell'>

                                <h3>
                                    {row}
                                    {/* {row !== '' ? ' Impact' : ''} */}
                                </h3>

                            </div>    
                        )   
                    }
                </div>
                <div className='grid-column'>
 
                    <div className='results-row'>

                        <div className='grid-cell'>
                            <p>
                            {   input &&
                                selectedOption ?
                                selectedTab === 'Employment' ?
                                    numeral(input).format('0,0') :
                                        selectedTab === 'Compensation' ?
                                            numeral(selectedIndustryInfo['Compensation Direct'] * 
                                            numeral(input/12).value()).format('$0,0') :
                                                selectedTab === 'Sales' ?
                                                    numeral(selectedIndustryInfo['Sales Direct'] * 
                                                    numeral(input/12).value()).format('$0,0')
                                : <DataLoader/>
                                : <DataLoader/>
                            }
                            </p>
                            {  input && selectedOption && selectedTab !== 'Employment' ?
                            <small>per Month</small>
                            :null
                            }
                        </div>


                    </div>
                    <div className='results-row'>

                    <div className='grid-cell'>
                        <p>
                        {!showBubbles ? input && selectedOption ?
                            numeral(selectedIndustryInfo[`${selectedTab} Indirect`] * 
                            selectedIndustryInfo[`${selectedTab} Direct`] *
                            numeral(selectedTab === 'Employment' ? input : input/12)
                                .value())
                                .format(selectedTab === 'Employment' ? '0,0' : '$0,0')
                            : <DataLoader /> : null}
                        </p>
                            {  input && selectedOption && selectedTab !== 'Employment' ?
                            <small>per Month</small>
                            :null
                            }
                        </div>
                    </div>
                    <div className='results-row'>
                        <div className='grid-cell'>
                            <p>
                            {!showBubbles ? input && selectedOption ?
                                numeral(selectedIndustryInfo[`${selectedTab} Induced`] * 
                                selectedIndustryInfo[`${selectedTab} Direct`] *
                                numeral(selectedTab === 'Employment' ? input : input/12)
                                    .value())
                                    .format(selectedTab === 'Employment' ? '0,0' : '$0,0')
                                : <DataLoader /> : null}
                            </p>
                            {  input && selectedOption && selectedTab !== 'Employment' ?
                            <small>per Month</small>
                            :null
                            }
                        </div>
                    </div>
                    <div className='results-row'>
                        <div className='grid-cell'>
                            <p>
                            {input && selectedOption ?
                                numeral(selectedIndustryInfo[`${selectedTab} Total Impact`] * 
                                selectedIndustryInfo[`${selectedTab} Direct`] *
                                numeral(selectedTab === 'Employment' ? input : input/12)
                                    .value())
                                    .format(selectedTab === 'Employment' ? '0,0' : '$0,0')
                                : <DataLoader />}
                            </p>
                            {  input && selectedOption && selectedTab !== 'Employment' ?
                            <small>per Month</small>
                            :null
                            }
                        </div>
                    </div>
                </div>

                {/* {
                    columns.map(column =>
                        <div className='grid-column'>
                            <div className='grid-cell'>
                                <h2 className='column-header'>
                                    {column}
                                </h2>
                            </div>
                            <div className='grid-cell'>
                                {
                                    input && selectedOption ?
                                        numeral(selectedIndustryInfo[`${column} Direct`] * numeral(input).value()).format('$0,0')
                                        : <DataLoader />
                                }
                            </div>
                            <div className='grid-cell'>
                                {
                                    input && selectedOption ?
                                        numeral(selectedIndustryInfo[`${column} Indirect`] *
                                            selectedIndustryInfo[`${column} Direct`] *
                                            numeral(input).value()).format('$0,0')
                                        : <DataLoader />}
                            </div>
                            <div className='grid-cell'>
                                {
                                    input && selectedOption ?
                                        numeral(data.find(item =>
                                            item['UID'] === selectedOption)[`${column} Induced`] *
                                            data.find(item =>
                                                item['UID'] === selectedOption)[`${column} Direct`] *
                                            numeral(input).value()).format('$0,0')
                                        : <DataLoader />}
                            </div>
                            <div className='grid-cell'>
                                {
                                    input && selectedOption ?
                                        numeral(data.find(item =>
                                            item['UID'] === selectedOption)[`${column} Total Impact`] *
                                            data.find(item =>
                                                item['UID'] === selectedOption)[`${column} Direct`] *
                                            numeral(input).value()).format('$0,0')
                                        : <DataLoader />}
                            </div>
                        </div>
                    )
                } */}

            </div>

            {
                selectedTab === 'Employment' &&
                input &&
                selectedOption ?
                <div 
                    id='bubble-toggle'
                    onClick={() => setShowBubbles(showBubbles ? false : true)}
                >
                    {/* <BubbleChartIcon /> */}
                    <small>{showBubbles ? 'Hide Impacted Industries' : 'Show Impacted Industries'}</small>
                </div> : null
            }

            {
                bubbleData.length > 0 && 
                input &&
                showBubbles ?
                <div id='bubble-chart'>
                    <BubbleChart 
                        id={'impacted-industries'} 
                        input={input}
                        data={bubbleData}
                        selectedIndustry={selectedOption} />
                </div>
                : null
            }

            <div id='footer'>
                <p>
                    <strong>*</strong> Atlanta-Sandy Springs-Roswell MSA
                </p>
                <h4>
                Data Source: <span id='data-source'>{dataSource}</span>
                </h4>

            </div>
        </div>
    )
}

export default App;