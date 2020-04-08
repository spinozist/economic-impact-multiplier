import React, { useState, useEffect } from "react";
import { Dropdown, Input } from 'semantic-ui-react';
import numeral from 'numeral';
import './App.css'


const App = () => {
    const [input, setInput] = useState();
    const [dropdownOptions, setDropdownOptions] = useState();
    const [selectedOption, setSelectedOption] = useState();

    const dataSource = 'JobsEQ Labor Insight'

    const data = require('./data/ImpactedJobXers.json');
    const options = data.map(item => ({
        text: item['Industry'],
        key: item['UID'],
        value: item['UID']
    }));

    const rows = ['', 'Direct', 'Indirect', 'Induced', 'Total'];
    const columns = ['Compensation', 'Sales'];

    useEffect(() => setDropdownOptions(options), [])

    return (
        <div id='main-wrapper'>
            <div>
                <Dropdown
                    selection
                    search
                    placeholder='Select an industry'
                    value={selectedOption}
                    options={dropdownOptions}
                    onChange={(e, data) => setSelectedOption(data.value)}
                />
            </div>

            <div id='main-grid'>
                <div className='grid-column'>
                    {
                        rows.map(row =>
                            <div>
                                <h3>
                                    {row}
                                    {row !== '' ? ' Loss' : ''}
                                </h3>
                            </div>    
                        )   
                    }
                    {/* <div />
                    <div>
                        <h3>
                        Direct Loss:
                        </h3>
                    </div>
                    <div>
                        <h3>
                        Indirect Loss:
                        </h3>
                    </div>
                    <div>
                        <h3>
                        Induced Loss:
                        </h3>
                    </div>
                    <div>
                        <h3>
                        Total Loss:
                        </h3>
                    </div> */}

                </div>
                <div className='grid-column'>
                    <div>
                        <h2>
                            Employment
                        </h2>
                    </div>
                    <div>
                        <Input
                            text
                            placeholder='Input expect job loss'
                            value={input ? numeral(input).format('0,0') : null}
                            onChange={(e, data) => setInput(data.value)}
                        />
                    </div>
                    <div className='results-row'>

                        <div>
                            {input && selectedOption ?
                                numeral(data.find(item =>
                                    item['UID'] === selectedOption)['Employment Indirect'] * numeral(input).value()).format('0,0')
                                : '***'}
                        </div>
                    </div>
                    <div className='results-row'>
                        <div>
                            {input && selectedOption ?
                                numeral(data.find(item =>
                                    item['UID'] === selectedOption)['Employment Induced'] * numeral(input).value()).format('0,0')
                                : '***'}
                        </div>
                    </div>
                    <div className='results-row'>
                        <div>
                            {input && selectedOption ?
                                numeral(data.find(item =>
                                    item['UID'] === selectedOption)['Employment Total Impact'] * numeral(input).value()).format('0,0')
                                : '***'}
                        </div>
                    </div>
                </div>

                {
                    columns.map(column =>
                        <div className='grid-column'>
                            <div>
                                <h2>
                                    {column}
                                </h2>
                            </div>
                            <div>
                                {
                                    input && selectedOption ?
                                        numeral(data.find(item =>
                                            item['UID'] === selectedOption)[`${column} Direct`] * numeral(input).value()).format('$0,0')
                                        : '***'
                                }
                            </div>
                            <div>
                                {
                                    input && selectedOption ?
                                        numeral(data.find(item =>
                                            item['UID'] === selectedOption)[`${column} Indirect`] *
                                            data.find(item =>
                                                item['UID'] === selectedOption)[`${column} Direct`] *
                                            numeral(input).value()).format('$0,0')
                                        : '***'}
                            </div>
                            <div>
                                {
                                    input && selectedOption ?
                                        numeral(data.find(item =>
                                            item['UID'] === selectedOption)[`${column} Induced`] *
                                            data.find(item =>
                                                item['UID'] === selectedOption)[`${column} Direct`] *
                                            numeral(input).value()).format('$0,0')
                                        : '***'}
                            </div>
                            <div>
                                {
                                    input && selectedOption ?
                                        numeral(data.find(item =>
                                            item['UID'] === selectedOption)[`${column} Total Impact`] *
                                            data.find(item =>
                                                item['UID'] === selectedOption)[`${column} Direct`] *
                                            numeral(input).value()).format('$0,0')
                                        : '***'}
                            </div>
                        </div>
                    )
                }

            </div>

            <div>
                Data Source: {dataSource}
            </div>
        </div>
    )
}

export default App;