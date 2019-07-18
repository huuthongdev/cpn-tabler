import React from 'react';
import * as convertValue from '../utils/convertValue';

export default function CpnPaging(props) {
    if (!props.pageNavigation) return null;
    const { params, pageNavigation, itemsPerPage } = props;
    const isShowTotal = typeof props.isShowTotal === 'boolean' ? props.isShowTotal : true;
    const { count, currentPage, onChange } = pageNavigation;

    const throwError = (msg) => {
        console.warn(`Page Navigation: ${msg}`);
        return null;
    }

    // if (typeof count !== 'number') return throwError('Prop "count" must is a number')
    if (typeof itemsPerPage !== 'number') return throwError('Prop "itemsPerPage" must is a number')
    if (typeof currentPage !== 'number') return throwError('Prop "currentPage" must is a number')
    if (typeof onChange !== 'function') return throwError('Prop "onChange" must is a function')

    const handleChange = (page) => onChange({ page, params: convertValue.cleanObj(params), itemsPerPage });

    const totalPage = Math.ceil(count / itemsPerPage);
    return <div className="cpn-table--cpn-paging">
        {isShowTotal ? <div className="total">
            Tổng <strong>{count}</strong> kết quả
        </div> : null}
        <div className="nav">
            {currentPage > 1 ? <div className="prev" onClick={() => {
                if (currentPage === 1) return;
                return handleChange(currentPage - 1);
            }}>
                <svg viewBox="0 0 6 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                        <g id="Mainboard-Copy-2" transform="translate(-1225.000000, -706.000000)" fill="#989898" fillRule="nonzero">
                            <g id="Group-11" transform="translate(31.000000, 108.000000)">
                                <g id="Group-24-Copy" transform="translate(1194.000000, 595.000000)">
                                    <path d="M5.49527827,8.49505142 L1.19543784,12.7947591 C0.921916047,13.0684136 0.478447351,13.0684136 0.205058349,12.7947591 C-0.0683527831,12.5213479 -0.0683527831,12.0779014 0.205058349,11.8045124 L4.0097533,7.99992807 L0.205169006,4.19547657 C-0.0682421262,3.92195478 -0.0682421262,3.47855247 0.205169006,3.20514134 C0.478580139,2.93161955 0.922026704,2.93161955 1.19554849,3.20514134 L5.49538893,7.50491538 C5.63209449,7.64168734 5.70036982,7.82075238 5.70036982,7.99990594 C5.70036982,8.17914803 5.6319617,8.35834586 5.49527827,8.49505142 Z" id="Path-Copy" transform="translate(2.850185, 8.000000) scale(-1, 1) translate(-2.850185, -8.000000) " />
                                </g>
                            </g>
                        </g>
                    </g>
                </svg>
            </div> : null}
            <p>Trang {currentPage}/{totalPage}</p>
            {currentPage < totalPage ? <div className="next" onClick={() => {
                if (currentPage >= totalPage) return;
                return handleChange(currentPage + 1);
            }}>
                <svg viewBox="0 0 6 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                        <g id="Mainboard-Copy-2" transform="translate(-1315.000000, -706.000000)" fill="#989898" fillRule="nonzero">
                            <g id="Group-11" transform="translate(31.000000, 108.000000)">
                                <g id="Group-24-Copy" transform="translate(1194.000000, 595.000000)">
                                    <path d="M95.4952783,8.49505142 L91.1954378,12.7947591 C90.921916,13.0684136 90.4784474,13.0684136 90.2050583,12.7947591 C89.9316472,12.5213479 89.9316472,12.0779014 90.2050583,11.8045124 L94.0097533,7.99992807 L90.205169,4.19547657 C89.9317579,3.92195478 89.9317579,3.47855247 90.205169,3.20514134 C90.4785801,2.93161955 90.9220267,2.93161955 91.1955485,3.20514134 L95.4953889,7.50491538 C95.6320945,7.64168734 95.7003698,7.82075238 95.7003698,7.99990594 C95.7003698,8.17914803 95.6319617,8.35834586 95.4952783,8.49505142 Z" id="Path" />
                                </g>
                            </g>
                        </g>
                    </g>
                </svg>
            </div> : null}
        </div>
    </div>
}