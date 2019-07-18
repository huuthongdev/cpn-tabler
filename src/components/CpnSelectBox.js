import React from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';

export default function CpnSelectBox(props) {
    const { value, onChange, loadOptions, options, onBlur, placeholder, isDisabled, cacheOptions, isMulti, searchable, returnFull, isClearable, asyncSelect } = props;
    if (asyncSelect) {
        return <AsyncSelect
            className="select"
            classNamePrefix="react-select"
            cacheOptions={cacheOptions === false ? false : true}
            value={value}
            isDisabled={isDisabled === true ? true : false}
            loadOptions={(text, callBack) => {
                if (loadOptions) loadOptions(text, callBack);
            }}
            onChange={select => {
                if (!onChange) return;
                if (!select) return onChange('');
                if (onChange) onChange(returnFull ? select : select.value);
            }}
            onBlur={(e) => {
                if (onBlur) onBlur(e);
            }}
            placeholder={placeholder || 'Tìm kiếm....'}
            isClearable={typeof isClearable === 'boolean' ? isClearable : true}
            loadingMessage={() => 'Đang tìm kiếm...'}
            noOptionsMessage={() => 'Chưa có kết quả nào.'}
        />
    }

    return <Select
        isMulti={isMulti}
        className={`select ${isMulti ? 'isMulti' : ''}`}
        classNamePrefix="react-select"
        value={value}
        isDisabled={isDisabled === true ? true : false}
        options={options}
        onChange={select => {
            if (!onChange) return;
            if (!select) return onChange('');
            if (isMulti) onChange(returnFull ? select : select.map(v => v.value));
            else onChange(returnFull ? select : select.value);
        }}
        onBlur={(e) => {
            if (onBlur) onBlur(e);
        }}
        placeholder={placeholder || '- Chọn -'}
        isClearable={typeof isClearable === 'boolean' ? isClearable : true}
        noOptionsMessage={() => 'Không có kết quả nào.'}
        searchable={searchable === false ? searchable : true}
    />
}