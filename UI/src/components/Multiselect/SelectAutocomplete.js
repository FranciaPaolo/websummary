import React, { useRef, useState, useEffect } from 'react';
import './SelectAutocomplete.css';
import AsyncSelect from 'react-select/async';

/**
 * optionItems is an array like this: 
    [{ id: 1, label: 'Option 1' },
    { id: 2, label: 'Option 2' }]
 * @param {*} param0 
 * @returns 
 */
const SelectAutocomplete = ({ optionItems, placeholder, size, onSelect, listSelectedWithText, preselectedIds }) => {

    const selectInputRef = useRef();
    const [selectedTextOptions, setSelectedTextOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    const customstyle = {
        control: base => ({
            ...base,
            height: 35,
            minHeight: 35
        })
    };

    useEffect(() => {

        if (preselectedIds && preselectedIds.length > 0) {
            setSelectedOptions(optionItems.filter((item) => preselectedIds.includes(item.id)));
            setSelectedTextOptions(optionItems.filter((item) => preselectedIds.includes(item.id)).map(m => m.label));
        }

    }, [preselectedIds, setSelectedTextOptions, optionItems]);

    const onSelectedItem = (selOption) => {

        let tmp_selectedOptions = [selectedOptions];

        if (listSelectedWithText) {
            if (selOption && !selectedTextOptions.includes(selOption.label)) {
                tmp_selectedOptions = [...selectedOptions, selOption];
                setSelectedOptions(tmp_selectedOptions);
                setSelectedTextOptions(tmp_selectedOptions.map(item => item.label).sort());

                if (onSelect) {
                    onSelect(tmp_selectedOptions.map(item => item.id));
                }
            }
            if (selOption) {
                setTimeout(() => {
                    selectInputRef.current.clearValue();
                }, 200);
            }
        }
    };

    const filterOptions = (inputValue) => {
        return optionItems.filter((option) =>
            option.label.toLowerCase().includes(inputValue.toLowerCase())
        );
    };

    const removeSelectedItem = (option) => {
        let tmp_selectedOptions = selectedOptions.filter((item) => item.value !== option.value);
        setSelectedOptions(tmp_selectedOptions);
        setSelectedTextOptions(tmp_selectedOptions.map(item => item.label).sort());

        if (onSelect) {
            onSelect(tmp_selectedOptions.map(item => item.id));
        }
    };

    const clearSelectedItems = () => {
        setSelectedOptions([]);
        setSelectedTextOptions([]);
        onSelect([]);
    };

    const loadOptions = (inputValue, callback) => {
        setTimeout(() => {
            callback(filterOptions(inputValue));
        }, 1000);
    };

    return <>
        <AsyncSelect 
            className={"react-select-container p-0" + (size && size === "small" ? " form-control-sm" : "")}
            styles={customstyle}
            ref={selectInputRef}
            isClearable={true}
            noOptionsMessage={() => 'Scrivi per cercare'}
            cacheOptions
            classNamePrefix="react-select"            
            onChange={onSelectedItem}
            loadOptions={loadOptions}
            placeholder={placeholder} />

        <div className={`${listSelectedWithText && listSelectedWithText === true && selectedOptions.length > 0 ? 'show' : 'd-none'}`}>
            {selectedOptions.map((opt, index) =>
                <span key={`wrap-${index}`}>
                    <small key={`item-${index}`} className="very-small">{opt.label}</small>
                    <small key={`close-${index}`} className="very-small" style={{ cursor: 'pointer' }} title="rimuovi" onClick={() => removeSelectedItem(opt)}>[x]&nbsp;</small>
                </span>
            )}
            <br />
            <small className="very-small" style={{ cursor: 'pointer' }} title="rimuovi tutto" onClick={clearSelectedItems}>cancella tutto</small>
        </div>
    </>;
};

export default SelectAutocomplete;