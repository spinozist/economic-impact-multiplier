import React, {useState, useEffect} from "react";
import {Dropdown, Input} from 'semantic-ui-react';
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
                  onChange={(e,data) => setSelectedOption(data.value)} 
                />
            </div>
            <div>
                    Direct Loss: 
            </div>
            <div>
                <Input 
                text
                placeholder='Input expect job loss'
                value={input ? numeral(input).format('0,0') : null}
                onChange={(e,data) => setInput(data.value)}
                />                
            </div>
            <div className='results-row'>
                <div>
                    Indirect Loss: 
                </div>
                <div>
                    {input && selectedOption ?
                        numeral(data.find(item => 
                            item['UID'] === selectedOption)['Employment Indirect'] * numeral(input).value()).format('0,0')
                        : '***'}
                </div>
            </div>
            <div className='results-row'>
                <div>
                    Induced Loss: 
                </div>
                <div>
                {input && selectedOption ?
                    numeral(data.find(item => 
                        item['UID'] === selectedOption)['Employment Induced'] * numeral(input).value()).format('0,0')
                    : '***'}
                </div>
            </div>
            <div className='results-row'>
                <div>
                    Total Loss: 
                </div>
                <div>
                {input && selectedOption ?
                    numeral(data.find(item => 
                        item['UID'] === selectedOption)['Employment Total Impact'] * numeral(input).value()).format('0,0')
                    : '***'}
                </div>
            </div>

        </div>
    )
}

export default App;