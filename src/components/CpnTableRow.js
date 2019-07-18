import React, { useState, useEffect } from 'react';
import CpnCheckBox from './CpnCheckBox';

export default function CpnTableRow(props) {
    // Props
    const { colValue, configCols, isSelected, onToggleSelect, link, isShowMultipleSelect, index, params, pageNavigation } = props;

    // Switch Statuss
    const [switchStatus, setSwitchStatus] = useState({});
    const [switchStatusLoading, setSwitchStatusLoading] = useState({});

    useEffect(() => {
        // Set Switch Status
        const colsSwitch = configCols.filter(v => typeof v.toggleSwitch === 'function');
        if (colsSwitch.length > 0) {
            let temp = {};

            for (let i = 0; i < colsSwitch.length; i++) {
                const item = colsSwitch[i];
                if (typeof colValue[item.key] !== 'boolean') return console.warn(`Index ${index} -  Key ${item.key}: Must be boolean type!`);
                temp[item.key] = colValue[item.key];
            }

            setSwitchStatus(temp);
        }
    }, [colValue, configCols, index]);

    return <tr>
        {isShowMultipleSelect ? <td className="cpn-table--col-select-box">
            <CpnCheckBox value={isSelected} onChange={() => onToggleSelect()} />
        </td> : null}
        {configCols.map((colConfigs, index) => {
            let { render, key, className, style, toggleSwitch } = colConfigs;
            className = className || '';
            if (link && colConfigs.link && link.className) className += ` ${link.className}`;

            return <td
                style={style}
                className={className}
                key={index}
                onClick={() => colConfigs.link && link && typeof link.onClick === 'function' ? link.onClick(colValue) : false}
            >
                {(() => {
                    if (typeof toggleSwitch === 'function') return <label
                        className={`cpn-table--switch ${switchStatusLoading[key] ? 'loading' : ''}`}
                    >
                        <input
                            type="checkbox"
                            checked={switchStatus[key] || false}
                            onChange={async () => {
                                if (switchStatusLoading[key]) return;

                                setSwitchStatus({
                                    ...switchStatus,
                                    [key]: !switchStatus[key]
                                })

                                setSwitchStatusLoading({
                                    ...switchStatusLoading,
                                    [key]: true
                                })

                                toggleSwitch({
                                    item: colValue,
                                    params,
                                    currentPage: (() => {
                                        if (pageNavigation && pageNavigation.currentPage) return pageNavigation.currentPage;
                                        return 1;
                                    })(),
                                    callBack: function (status) {
                                        if (!status) setSwitchStatus({
                                            ...switchStatus,
                                            [key]: switchStatus[key]
                                        })

                                        setSwitchStatusLoading({
                                            ...switchStatusLoading,
                                            [key]: false
                                        })
                                    }
                                })
                            }}
                        />
                        <span className="slider round" />
                    </label>

                    if (render) return render(colValue);
                    return colValue[colConfigs.key];
                })()}
            </td>
        })}
    </tr>
}