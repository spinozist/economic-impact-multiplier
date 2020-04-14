import React, { useState, useEffect } from "react";
import { Dropdown, Input } from 'semantic-ui-react';
import numeral from 'numeral';
import BubbleChart from './components/BubbleChart';
import Loader from 'react-loader-spinner';
// import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import './App.css'


const App = () => {
    const [input, setInput] = useState();
    const [dropdownOptions, setDropdownOptions] = useState();
    const [selectedOption, setSelectedOption] = useState();
    const [selectedTab, setSelectedTab] = useState('Employment');
    const [showBubbles, setShowBubbles] = useState(true);

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
    
    console.log(bubbleData);

    useEffect(() => setDropdownOptions(options), [])

    return (
        <div id='main-wrapper'>
            <div id='title-wrapper'>
                <h1 id='title'>
                   Job Loss Impact Calculator 
                </h1>
                <h3 id='subtitle'>
                    for the Atlanta Metro Region<sup>*</sup></h3>
            </div>
            <div id='input-wrapper'>
            <Input
                focus
                text
                placeholder='Enter expected job loss'
                value={input ? numeral(input).format('0,0') : null}
                onChange={(e, data) => setInput(data.value)}
            />
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
                                    {row !== '' ? ' Loss' : ''}
                                </h3>
                            </div>    
                        )   
                    }
                </div>
                <div className='grid-column'>
 
                    <div className='results-row'>

                        <div className='grid-cell'>
                            {   input &&
                                selectedOption ?
                                selectedTab === 'Employment' ?
                                    numeral(input).format('0,0') :
                                        selectedTab === 'Compensation' ?
                                            numeral(selectedIndustryInfo['Compensation Direct'] * 
                                            numeral(input).value()).format('$0,0') :
                                                selectedTab === 'Sales' ?
                                                    numeral(selectedIndustryInfo['Sales Direct'] * 
                                                    numeral(input).value()).format('$0,0')
                                : <DataLoader/>
                                : <DataLoader/>
                            }
                        </div>


                    </div>
                    <div className='results-row'>

                    <div 
                        className={
                            input && 
                            selectedOption &
                            showBubbles ?
                            'grid-cell hidden' 
                            : 'grid-cell'
                        }
                    >
                        {input && selectedOption ?
                            numeral(selectedIndustryInfo[`${selectedTab} Indirect`] * 
                            selectedIndustryInfo[`${selectedTab} Direct`] *
                            numeral(input)
                                .value())
                                .format(selectedTab === 'Employment' ? '0,0' : '$0,0')
                            : <DataLoader />}
                        </div>
                    </div>
                    <div className='results-row'>
                        <div 
                            className={
                                input && 
                                selectedOption &
                                showBubbles ?
                                'grid-cell hidden' 
                                : 'grid-cell'
                            }
                        >
                            {input && selectedOption ?
                                numeral(selectedIndustryInfo[`${selectedTab} Induced`] * 
                                selectedIndustryInfo[`${selectedTab} Direct`] *
                                numeral(input)
                                    .value())
                                    .format(selectedTab === 'Employment' ? '0,0' : '$0,0')
                                : <DataLoader />}
                        </div>
                    </div>
                    <div className='results-row'>
                        <div className='grid-cell'>
                            {input && selectedOption ?
                                numeral(selectedIndustryInfo[`${selectedTab} Total Impact`] * 
                                selectedIndustryInfo[`${selectedTab} Direct`] *
                                numeral(input)
                                    .value())
                                    .format(selectedTab === 'Employment' ? '0,0' : '$0,0')
                                : <DataLoader />}
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
                <h4>
                Data Source: <span id='data-source'>{dataSource}</span>
                </h4>
                <p>
                    <strong>*</strong> Atlanta-Sandy Springs-Roswell MSA
                </p>
            </div>
        </div>
    )
}

export default App;