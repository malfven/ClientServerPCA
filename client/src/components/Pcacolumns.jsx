import React, { useState } from 'react'

//Combo box for marker values
function Pcacolumns({ markerData, markerCallback }) {
    const [selectedOption, setSelectedOption] = useState(markerData[0]);
    
    const handleChange = (value, selectOptionSetter) => {
        selectOptionSetter(value)
        markerCallback(value);
    }

    return <div>
        <div>
            <select value={selectedOption}
                onChange={e => handleChange(e.target.value, setSelectedOption)}>
                <option></option>
                {
                    markerData.map((result) => (<option key={result} value={result} label={result}></option>))
                }
            </select>
        </div>
    </div>
}

export default Pcacolumns