import React from 'react';
import CpnIcon from './CpnIcon';

export default function CpnLoading(props) {
     return <div className="cpn-table--cpn-loading">
         <CpnIcon name="LOADING_GRAY"/>
         Đang tải dữ liệu...
    </div>
}