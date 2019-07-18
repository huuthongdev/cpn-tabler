import React from 'react';

export default function CpnIcon(props) {
    const { name } = props;
    if (name === 'LOADING_WHITE' || name === 'LOADING_GRAY') return <div className={`cpn-table--loading-icon cpn-table--loading-icon--animating cpn-table--loading-icon--${name === 'LOADING_WHITE' ? 'white' : 'gray'}`}>
        <div className="cpn-table--loading-icon__blade" />
        <div className="cpn-table--loading-icon__blade" />
        <div className="cpn-table--loading-icon__blade" />
        <div className="cpn-table--loading-icon__blade" />
        <div className="cpn-table--loading-icon__blade" />
        <div className="cpn-table--loading-icon__blade" />
        <div className="cpn-table--loading-icon__blade" />
        <div className="cpn-table--loading-icon__blade" />
        <div className="cpn-table--loading-icon__blade" />
        <div className="cpn-table--loading-icon__blade" />
        <div className="cpn-table--loading-icon__blade" />
        <div className="cpn-table--loading-icon__blade" />
    </div>

    if (name === 'LOADING-ELLIPSIS') return <div className="loading-ellipsis"><div></div><div></div><div></div><div></div></div>
    return null;
}