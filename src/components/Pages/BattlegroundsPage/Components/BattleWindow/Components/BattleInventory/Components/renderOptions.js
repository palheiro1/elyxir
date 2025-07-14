import { optionStyle } from '../data';

export const renderOptions = (defaultLabel, options) => (
    <>
        <option value="-1" style={optionStyle}>
            {defaultLabel}
        </option>
        {options.map(({ value, label }) => (
            <option key={value} value={value} style={optionStyle}>
                {label}
            </option>
        ))}
    </>
);
