import React, { useState, useRef, useEffect } from 'react';
import { Form } from 'react-bootstrap';

/**
 * optionItems is an array like this:
    [{ id: 1, label: 'Option 1' },
    { id: 2, label: 'Option 2' }]

    size:
     "" empty (standard)
     "small"
 * @param {*} param0
 * @returns
 */
const MultiSelectDropdown = ({ optionItems, placeholder, size, onSelect, listSelectedWithText, preselectedIds }) => {
    // eslint-disable-next-line
    const [optionItemsState, setOptionItemsState] = useState(optionItems);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedTextOptions, setSelectedTextOptions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {

        const handleClickOutside = (event) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (preselectedIds && preselectedIds.length > 0) {
            setSelectedOptions(preselectedIds);
            setSelectedTextOptions(optionItems.filter((item) => preselectedIds.includes(item.id)).map(m => m.label));
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [preselectedIds,setSelectedTextOptions, optionItems]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionChange = (event) => {
        const optionId = event.target.value;
        const item = optionItems.filter((item) => item.id === optionId)[0];
        const isChecked = event.target.checked;
        let tmp_selectedOptions = [];

        if (isChecked) {
            tmp_selectedOptions = [...selectedOptions, optionId];
            setSelectedTextOptions([...selectedTextOptions, item.label]);
        } else {
            tmp_selectedOptions = selectedOptions.filter((id) => id !== optionId);
            setSelectedTextOptions(optionItems.filter((item) => tmp_selectedOptions.includes(item.id)).map(m => m.label));
        }
        setSelectedOptions(tmp_selectedOptions);
        onSelect(tmp_selectedOptions);
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const filteredOptions = optionItems.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div ref={dropdownRef} className={`dropdown ${isOpen ? 'show' : ''}`}>
            <input type="text" className={"form-control" + (size && size === "small" ? " form-control-sm" : "")} id="multiselectItems"
            onClick={toggleDropdown}
            onChange={handleInputChange}
            placeholder={placeholder}
            title={selectedTextOptions.length > 0 ? selectedTextOptions.join(", ") : placeholder} />
            <div className={`dropdown-menu px-2 ${isOpen ? 'show' : ''}`} aria-labelledby="multiSelectDropdown"
                style={{ maxHeight: "300px", overflowY: "auto" }}>
                {filteredOptions.map((option) => (
                    <Form.Check
                        className={"" + (size && size === "small" ? " small" : "")}
                        key={option.id}
                        type="checkbox"
                        id={`option_${option.id}`}
                        label={option.label}
                        checked={selectedOptions.includes(option.id)}
                        onChange={handleOptionChange}
                        value={option.id}
                    />
                ))}
            </div>
            <div className={`${listSelectedWithText && listSelectedWithText === true ? 'show' : 'd-none'}`}>
                <small className="very-small">{selectedTextOptions.join(", ")}</small>
            </div>
        </div>
    );
};

export default MultiSelectDropdown;