import React, { useState, useEffect, Fragment } from 'react';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
// Styles
import "./styles/main.scss";
import "./styles/theme.scss";
// Components
import CpnLoading from './components/CpnLoading';
import CpnErrorMessage from './components/CpnErrorMessage';
import CpnCheckBox from './components/CpnCheckBox';
import CpnEmptyData from './components/CpnEmptyData';
import CpnTableRow from './components/CpnTableRow';
import CpnSelectBox from './components/CpnSelectBox';
import CpnIcon from './components/CpnIcon';
import CpnPaging from './components/CpnPaging';
import CpnSearchBox from './components/CpnSearchBox';
// Utils
import * as convertValue from './utils/convertValue';
import PropTypes from 'prop-types';

const filterTypes = {
  text: 'text',
  select: 'select',
  asyncSelect: 'async-select',
  timeRange: 'time-range',
}

const paramTypes = {
  sort: 'sort',
  filter: 'filter',
}

export default function CpnTabler(props) {
  const [selectIndexs, setSelectIndexs] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [sortOptions, setSortOptions] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(props.pageNavigation ? props.pageNavigation.itemsPerPage || 10 : 10);

  const [isPressShift, setIsPressShift] = useState(false);
  const [isShowFilter, setIsShowFilter] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isLoadingReloadPage, setIsLoadingReloadPage] = useState(false);

  let checkTyping = null;
  const isShowReloadPage = typeof props.isShowReloadPage === 'boolean' ? props.isShowReloadPage : true;
  const isShowRefreshPage = typeof props.isShowRefreshPage === 'boolean' ? props.isShowRefreshPage : true;
  const isShouldShowFilter = !props.configCols.every(v => !!!v.filter);

  const { isLoading, errorMessage, configCols, onChangeParams, pageNavigation, buttons, search } = props;
  const data = props.data || [];

  const isShowMultipleSelect = (() => {
    if (props.buttons && props.buttons.multipleSelect && props.buttons.multipleSelect.actions && props.buttons.multipleSelect.actions.length > 0) return true;
    return false;
  })();

  // Set default filter options
  useEffect(() => {
    const isHasDefaultFilter = configCols.filter(v => v.filter && v.filter.defaultValue);

    if (isHasDefaultFilter && isHasDefaultFilter.length > 0) {
      let filterOptions = {};

      for (let i = 0; i < isHasDefaultFilter.length; i++) {
        const item = isHasDefaultFilter[i];

        switch (item.filter.type) {
          case 'select':
            filterOptions[item.key] = item.filter.defaultValue.value;
            break;

          default:
            filterOptions[item.key] = item.filter.defaultValue;
            break;
        }
      }

      setFilterOptions(filterOptions);
    }

    if (configCols.filter(v => v.filter).length === 0) { setIsShowFilter(false); }
  }, [props])

  // Detect press shift on select configCols
  useEffect(() => {
    if (!isShowMultipleSelect) return;

    document.onkeydown = function (e) {
      if (e.which === 16) setIsPressShift(true);
    }

    document.onkeyup = function (e) {
      if (e.which === 16) setIsPressShift(false);
    }

    return () => {
      document.onkeydown = null;
      document.onkeyup = null;
    }
  }, [props, isShowMultipleSelect])


  // Handle select configCols
  const onToggleSelect = (index) => {
    if (!isShowMultipleSelect) return;
    let temp = selectIndexs;

    if (temp.includes(index)) {
      temp = temp.filter(v => v !== index);
    } else {
      if (isPressShift) {
        let max = Math.max(...temp);
        max = max >= 0 ? max : null;
        if (max !== null && index > max) {
          for (let i = max + 1; i < index; i++) {
            temp = [...temp, i];
          }
        }
      }
      temp = [...temp, index];
    }

    return setSelectIndexs(temp);
  }

  const colsCount = configCols.length + (isShowMultipleSelect ? 1 : 0);

  function RowMeta(props) {
    return <tr className="cpn-table--row-meta">
      <td colSpan={colsCount}>
        {props.children}
      </td>
    </tr>
  }

  // Handles
  function handleChangeParams(...params) {
    let newParams = {};
    for (let i = 0; i < params.length; i++) {
      const item = params[i];
      if (item.type === paramTypes.filter) setFilterOptions({ ...filterOptions, [item.key]: item.value });
      if (item.type === paramTypes.sort) setSortOptions({ ...sortOptions, [item.key]: item.value });
      newParams[item.key] = item.value;
    }

    if (!onChangeParams) return console.error('Prop "onChangeParams" must be provided.');
    onChangeParams({
      params: convertValue.cleanObj({ ...filterOptions, ...sortOptions, ...newParams }),
      page: pageNavigation && pageNavigation.currentPage ? pageNavigation.currentPage : 1,
      itemsPerPage,
    });
  }

  return <div className="cpn-table">
    <div className="cpn-table--tools">
      <CpnSearchBox search={search} />

      <div className="buttons-group">
        {isShowReloadPage ? <div className="set-items-per-page">
          Hiển thị
                    <select value={itemsPerPage} onChange={e => {
            setItemsPerPage(+e.target.value);
            pageNavigation.onChange({
              params: convertValue.cleanObj({ ...filterOptions, ...sortOptions }),
              page: pageNavigation.currentPage,
              itemsPerPage: +e.target.value
            })
          }} className="cpn-table--btn">
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={40}>40</option>
            <option value={50}>50</option>
          </select>
        </div> : null}

        {isShowRefreshPage && pageNavigation && pageNavigation.onChange ? <div
          className={`cpn-table--btn reload-page ${isLoadingReloadPage ? 'active' : ''}`}
          onClick={async () => {
            setIsLoadingReloadPage(true);
            await pageNavigation.onChange({
              params: convertValue.cleanObj({ ...filterOptions, ...sortOptions }),
              page: pageNavigation.currentPage,
              itemsPerPage,
            })
            setIsLoadingReloadPage(false);
          }}
        >
          Làm mới
                    <svg viewBox="0 0 10 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
              <g id="Mainboard-Copy-2" transform="translate(-1089.000000, -133.000000)" fill="#989898" fillRule="nonzero">
                <g id="Group-11" transform="translate(31.000000, 108.000000)">
                  <g id="Group-5" transform="translate(776.000000, 12.000000)">
                    <g id="Group-4" transform="translate(206.000000, 0.000000)">
                      <g id={159612} transform="translate(76.000000, 13.000000)">
                        <path d="M0.046097561,6.41019512 C-0.0270731707,5.77604878 0.033902439,5.16385366 0.199756098,4.598 C0.75097561,2.7175122 2.4802439,1.33458537 4.53146341,1.31019512 L4.53146341,0.0809268293 C4.53146341,0.0126341463 4.61682927,-0.0239512195 4.67292683,0.0175121951 L7.20219512,1.87604878 C7.24365854,1.9077561 7.24365854,1.97117073 7.20219512,2.00043902 L4.67536585,3.85897561 C4.61682927,3.90043902 4.53390244,3.86385366 4.53390244,3.79556098 L4.53390244,2.56873171 C3.18512195,2.59068293 2.03390244,3.42239024 1.53878049,4.598 C1.35097561,5.04190244 1.25585366,5.53214634 1.28268293,6.04678049 C1.31926829,6.75409756 1.58512195,7.40531707 2.00463415,7.93214634 C2.22902439,8.21263415 2.17536585,8.62239024 1.88512195,8.83458537 C1.6095122,9.03702439 1.22414634,8.98092683 1.01195122,8.71263415 C0.492439024,8.06385366 0.146097561,7.27360976 0.046097561,6.41019512 Z M7.34853659,4.04921951 C7.7704878,4.57360976 8.03634146,5.22726829 8.0704878,5.93458537 C8.09731707,6.45165854 7.9997561,6.94190244 7.81439024,7.38336585 C7.31926829,8.55897561 6.16804878,9.39312195 4.81926829,9.41263415 L4.81926829,8.18580488 C4.81926829,8.1175122 4.73390244,8.08092683 4.67780488,8.12239024 L2.14853659,9.98092683 C2.10707317,10.0126341 2.10707317,10.0760488 2.14853659,10.1053171 L4.67536585,11.9638537 C4.73390244,12.0053171 4.81682927,11.9687317 4.81682927,11.900439 L4.81682927,10.6711707 C6.86804878,10.6492195 8.5997561,9.26629268 9.14853659,7.38336585 C9.31439024,6.8175122 9.37292683,6.20531707 9.30219512,5.57117073 C9.20463415,4.7077561 8.85829268,3.9175122 8.33878049,3.26873171 C8.12414634,3.00043902 7.74121951,2.94434146 7.46560976,3.14678049 C7.17780488,3.35897561 7.12414634,3.76873171 7.34853659,4.04921951 Z" id="Shape" />
                      </g>
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div> : null}

        {isShouldShowFilter ? <div className={`cpn-table--btn toggle-filter ${isShowFilter ? 'active' : ''}`} onClick={() => setIsShowFilter(!isShowFilter)}>
          Bộ lọc

                    <svg viewBox="0 0 8 5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
              <g id="Mainboard-Copy-2" transform="translate(-1194.000000, -137.000000)" fill="#989898">
                <g id="Group-11" transform="translate(31.000000, 108.000000)">
                  <g id="Group-5" transform="translate(776.000000, 12.000000)">
                    <path d="M387.097839,18.3167347 C386.967387,18.1862824 386.967387,17.9748003 387.097839,17.844348 L387.844923,17.0978392 C387.9748,16.9673869 388.186282,16.9673869 388.316735,17.0978392 L390.683265,19.4643699 C390.813718,19.5942475 391.0252,19.5942475 391.155077,19.4643699 L393.521608,17.0978392 C393.65206,16.9673869 393.863542,16.9673869 393.993995,17.0978392 L394.741078,17.844348 C394.870956,17.9748003 394.870956,18.1862824 394.741078,18.3167347 L391.155077,21.9021608 C391.0252,22.0326131 390.813718,22.0326131 390.683265,21.9021608 L387.097839,18.3167347 Z" id="Icon-Dropdown" />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div> : null}

        {(() => {
          if (!buttons || typeof buttons !== 'object') return null;
          const { add, multipleSelect } = buttons;
          return <Fragment>
            {add ? <div className="cpn-table--btn create"
              onClick={() => {
                if (add.onClick) add.onClick();
              }}
            >
              {add.label || 'Tạo mới'}
            </div> : null}

            {(() => {
              if (!multipleSelect || selectIndexs.length === 0) return null;

              if (!multipleSelect.actions
                || !Array.isArray(multipleSelect.actions)
                || !multipleSelect.actions.every(v => v.onClick && typeof v.onClick === 'function')
                || multipleSelect.actions.length === 0
              ) {
                console.warn(`Prop "buttons -> selects" INVALID`);
                return null;
              }

              if (isLoadingAction) {
                return <div className="cpn-table--btn actions dropdown">
                  <CpnIcon name="LOADING_GRAY" />
                </div>
              }

              return <div className="cpn-table--btn actions dropdown">
                {multipleSelect.label || 'Thao tác'}
                <svg viewBox="0 0 7 5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                  <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                    <g id="Mainboard-Copy-3" transform="translate(-283.000000, -90.000000)" fill="#546E7A">
                      <g id="Group-22">
                        <g id="Group-19" transform="translate(235.000000, 84.000000)">
                          <g id="25629-copy-4" transform="translate(48.000000, 6.000000)">
                            <path d="M6.83372525,0.479025424 L6.49681667,0.158207071 C6.38006555,0.0527456771 6.24370641,0 6.08805399,0 C5.92919126,0 5.79445301,0.0527456771 5.68361892,0.158207071 L3.50001574,2.23690507 L1.31642829,0.158266992 C1.20560993,0.0528055984 1.07084021,5.99212464e-05 0.91204043,5.99212464e-05 C0.756309322,5.99212464e-05 0.619981655,0.0528055984 0.503214798,0.158266992 L0.170728253,0.479085345 C0.0568884352,0.587378017 0,0.717152457 0,0.86828882 C0,1.02224148 0.0569513823,1.15054785 0.170712516,1.25317797 L3.09561214,4.03749358 C3.20348772,4.14580123 3.33821023,4.2 3.5,4.2 C3.65875257,4.2 3.7950645,4.14581621 3.90879416,4.03749358 L6.83370951,1.25317797 C6.94454361,1.14765665 7,1.01936526 7,0.86828882 C7.00001573,0.719968755 6.94455934,0.590269218 6.83372525,0.479025424 Z" id="Path" />
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>

                <div className="dropdown-list">
                  {multipleSelect.actions.map((btn, key) => <div className="item" key={key} onClick={() => {
                    setIsLoadingAction(true);
                    return btn.onClick({
                      selects: selectIndexs.map(v => props.data[v]),
                      setDone: () => setIsLoadingAction(false)
                    })
                  }}>
                    {btn.label || `Hành động ${key + 1}`}
                  </div>)}
                </div>

              </div>
            })()}
          </Fragment>
        })()}
      </div>
    </div>

    <div>
      <CpnPaging itemsPerPage={itemsPerPage} pageNavigation={props.pageNavigation} params={Object.assign(filterOptions, sortOptions)} />
    </div>

    <table>
      <thead>
        <tr>
          {isShowMultipleSelect ? <th className="cpn-table--col-select-box">
            <CpnCheckBox value={selectIndexs.length === data.length} onChange={() => {
              if (selectIndexs.length === data.length) {
                setSelectIndexs([]);
              } else {
                setSelectIndexs(new Array(data.length).fill(0).map((v, k) => v = k))
              }
            }} />
          </th> : null}

          {configCols.map((col, key) => {
            const style = col.style;
            let isSort = false;
            let sortClassName = '';

            if (col.sort) {
              const throwError = (message) => {
                console.warn(`Row (key:${col.key} - label:${col.label}) | ${message}`);
              }

              const { increase, descrease, key } = col.sort;
              // Validate
              if (typeof increase === 'undefined') return throwError(`Prop "increase" must be provided when use sort`);
              if (typeof descrease === 'undefined') return throwError(`Prop "descrease" must be provided when use sort`);
              if (typeof key === 'undefined') return throwError(`Prop "key" must be provided when use sort`);
              isSort = true;

              if (sortOptions[key] === increase) sortClassName = 'increase';
              if (sortOptions[key] === descrease) sortClassName = 'descrease';
            }

            return <th
              style={style}
              key={key}
              className={`${isSort ? 'cpn-table--has-sort' : ''} ${sortClassName} ${sortClassName ? 'sort-active' : ''}`}
              onClick={() => {
                if (!isSort) return;
                const { increase, descrease, key } = col.sort;
                if (sortClassName === 'increase') return handleChangeParams({ type: 'sort', key, value: descrease })
                if (sortClassName === 'descrease') return handleChangeParams({ type: 'sort', key, value: increase })
                return handleChangeParams({ type: 'sort', key, value: descrease })
              }}
            >
              {col.label}
              {(() => {
                if (isSort) {
                  if (sortClassName) return <div className="cpn-table--sort-icon">
                    <svg viewBox="0 0 7 5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                      <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                        <g id="Mainboard-Copy-3" transform="translate(-283.000000, -90.000000)" fill="#546E7A">
                          <g id="Group-22">
                            <g id="Group-19" transform="translate(235.000000, 84.000000)">
                              <g id="25629-copy-4" transform="translate(48.000000, 6.000000)">
                                <path d="M6.83372525,0.479025424 L6.49681667,0.158207071 C6.38006555,0.0527456771 6.24370641,0 6.08805399,0 C5.92919126,0 5.79445301,0.0527456771 5.68361892,0.158207071 L3.50001574,2.23690507 L1.31642829,0.158266992 C1.20560993,0.0528055984 1.07084021,5.99212464e-05 0.91204043,5.99212464e-05 C0.756309322,5.99212464e-05 0.619981655,0.0528055984 0.503214798,0.158266992 L0.170728253,0.479085345 C0.0568884352,0.587378017 0,0.717152457 0,0.86828882 C0,1.02224148 0.0569513823,1.15054785 0.170712516,1.25317797 L3.09561214,4.03749358 C3.20348772,4.14580123 3.33821023,4.2 3.5,4.2 C3.65875257,4.2 3.7950645,4.14581621 3.90879416,4.03749358 L6.83370951,1.25317797 C6.94454361,1.14765665 7,1.01936526 7,0.86828882 C7.00001573,0.719968755 6.94455934,0.590269218 6.83372525,0.479025424 Z" id="Path" />
                              </g>
                            </g>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>

                  return <div className="cpn-table--sort-icon has-sort">
                    <svg viewBox="0 0 294 402" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                      <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                        <g id={25756} fill="#546E7A" fillRule="nonzero">
                          <path d="M19.092,164.452 L274.905,164.452 C279.854,164.452 284.138,162.645 287.753,159.028 C291.366,155.412 293.18,151.13 293.18,146.181 C293.18,141.232 291.367,136.952 287.753,133.331 L159.846,5.424 C156.232,1.812 151.951,0 146.999,0 C142.047,0 137.766,1.812 134.149,5.424 L6.242,133.331 C2.625,136.948 0.818,141.232 0.818,146.181 C0.818,151.129 2.625,155.412 6.242,159.028 C9.863,162.645 14.144,164.452 19.092,164.452 Z" id="Path" />
                          <path d="M274.905,237.549 L19.092,237.549 C14.14,237.549 9.859,239.357 6.242,242.97 C2.625,246.587 0.818,250.868 0.818,255.817 C0.818,260.766 2.625,265.05 6.242,268.665 L134.149,396.57 C137.77,400.187 142.051,401.998 146.999,401.998 C151.947,401.998 156.232,400.187 159.846,396.57 L287.753,268.664 C291.366,265.05 293.18,260.766 293.18,255.816 C293.18,250.868 291.367,246.587 287.753,242.969 C284.139,239.353 279.854,237.549 274.905,237.549 Z" id="Path" />
                        </g>
                      </g>
                    </svg>
                  </div>
                }
              })()}
            </th>;
          })}
        </tr>

        {isShowFilter && isShouldShowFilter ? <tr className="cpn-table--row-filters">
          {isShowMultipleSelect ? <th /> : null}
          {configCols.map((col, key) => {
            if (!col.filter) return <th key={key} />

            // Validate props
            const throwError = (message) => {
              console.warn(`Row (key:${col.key} - label:${col.label}) | ${message}`);
              return <th key={key} />
            }

            const { type, placeHolder, options, loadOptions, defaultValue } = col.filter;

            if (!col.key) return throwError('Prop "key" must be provided when use filter')
            // Type
            if (!type) return throwError('Prop "type" must be provided when use filter')
            if (!Object.values(filterTypes).includes(type)) return throwError(`Invalid props "type"`);

            // Props required
            if (type === filterTypes.select) {
              if (!options) return throwError(`Prop "options" must be provided when use filter with type: "${filterTypes.select}"`);
              else if (!Array.isArray(options)) return throwError(`Prop "options" is invalid: must be array ([{ label: 'Label A', value: 'Value Options A' }])`);
              else if (!options.every(v => v.label && typeof v.value !== 'undefined')) return throwError(`Prop "options" is invalid: must be array ([{ label: 'Label A', value: 'Value Options A' }])`);
              return <th key={key}>
                <CpnSelectBox
                  isClearable
                  options={options}
                  placeholder={placeHolder || 'Chọn'}
                  defaultValue={defaultValue || ''}
                  onChange={(select) => {
                    handleChangeParams({ type: paramTypes.filter, key: col.key, value: select });
                  }}
                />
              </th>
            }

            if (type === filterTypes.asyncSelect) {
              if (!loadOptions) return throwError(`Prop "loadOptions" must be provided when use filter with typ: "${filterTypes.asyncSelect}"`);
              if (typeof loadOptions !== 'function') return throwError(`Prop "loadOptions" is invalid: muse be function(text, callBack)`);
              return <th key={key}>
                <CpnSelectBox
                  asyncSelect
                  loadOptions={(text, callBack) => loadOptions(text, callBack)}
                  onChange={(select) => handleChangeParams({ type: paramTypes.filter, key: col.key, value: select })}
                  placeholder={placeHolder}
                />
              </th>
            }

            if (type === filterTypes.timeRange) {
              const { startKey, endKey } = col.filter;
              if (!startKey) return throwError(`Prop "startKey" must be provided when use filter with type: "${filterTypes.timeRange}"`);
              if (!endKey) return throwError(`Prop "endKey" must be provided when use filter with type: "${filterTypes.timeRange}"`);

              return <th key={key}>
                <div className="cpn-table--time-range">
                  <div className="item">
                    <DatePicker
                      selected={filterOptions[startKey] ? new Date(convertValue.convertTimeToSecond(filterOptions[startKey], true)) : null}
                      onChange={(date) => {
                        const startValue = date ? convertValue.convertTimeToSecond(date) : null;
                        const endValue = filterOptions[endKey] || '';

                        setFilterOptions({ ...filterOptions, [startKey]: startValue })

                        if (startValue && endValue) {
                          return handleChangeParams(
                            { type: 'filter', key: startKey, value: startValue },
                            { type: 'filter', key: endKey, value: endValue }
                          );
                        }
                      }}
                      maxDate={filterOptions[endKey] ? new Date(convertValue.convertTimeToSecond(filterOptions[endKey], true) - 1000 * 60 * 60 * 24) : null}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy - hh:mm aa"
                      placeholderText="Từ ngày"
                      isClearable
                    />
                  </div>
                  <div className="dash">
                    -
                                </div>
                  <div className="item">
                    <DatePicker
                      selected={filterOptions[endKey] ? new Date(convertValue.convertTimeToSecond(filterOptions[endKey], true)) : null}
                      onChange={(date) => {
                        const startValue = filterOptions[startKey];
                        const endValue = date ? convertValue.convertTimeToSecond(date) : '';
                        setFilterOptions({ ...filterOptions, [endKey]: endValue });

                        if (startValue && endValue) {
                          return handleChangeParams(
                            { type: 'filter', key: startKey, value: startValue },
                            { type: 'filter', key: endKey, value: endValue }
                          );
                        }
                      }}
                      minDate={filterOptions[startKey] ? new Date(convertValue.convertTimeToSecond(filterOptions[startKey], true) + 1000 * 60 * 60 * 24) : null}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={15}
                      dateFormat="dd/MM/yyyy - hh:mm aa"
                      placeholderText="Đến ngày"
                      isClearable
                    />
                  </div>
                </div>
              </th>
            }

            let textInput = '';

            return <th key={key}>
              {(() => {
                if (type === 'text') return <div className="cpn-table--text-input">
                  <input
                    ref={el => textInput = el}
                    defaultValue={defaultValue || ''}
                    type="text"
                    placeholder={placeHolder || 'Nhập...'}
                    onChange={e => {
                      const value = e.target.value;
                      setFilterOptions({ ...filterOptions, [col.key]: value })
                      clearTimeout(checkTyping);
                      checkTyping = setTimeout(() => {
                        // Run when user stop typing
                        console.log('stoped');
                        handleChangeParams({ type: 'filter', key: [col.key], value })
                      }, 500)
                    }}
                  />
                  {filterOptions[col.key] ? <div className="cpn-table--text-input---btn-clear"
                    onClick={() => {
                      textInput.value = '';
                      handleChangeParams({ type: 'filter', key: [col.key], value: '' })
                    }}
                  >x</div> : null}
                </div>
              })()}
            </th>



          })}
        </tr> : null}
      </thead>

      <tbody>
        {(() => {
          if (isLoading) return <RowMeta ><CpnLoading /></RowMeta>
          if (errorMessage) return <RowMeta><CpnErrorMessage message={errorMessage} /></RowMeta>
          if (data.length === 0) return <RowMeta> <CpnEmptyData /></RowMeta>
        })()}

        {data.map((value, key) => <CpnTableRow
          {...props}
          filterOptions={filterOptions}
          key={key}
          index={key}
          colValue={value}
          isSelected={selectIndexs.includes(key)}
          onToggleSelect={() => onToggleSelect(key)}
          isShowMultipleSelect={isShowMultipleSelect}
          params={Object.assign(filterOptions, sortOptions)}
        />)}
      </tbody>
    </table>

    <div>
      <CpnPaging itemsPerPage={itemsPerPage} pageNavigation={props.pageNavigation} params={Object.assign(filterOptions, sortOptions)} />
    </div>
  </div>
}

CpnTabler.propTypes = {
  isLoading: PropTypes.bool,
  errorMessage: PropTypes.string,
  data: PropTypes.array,
  configCols: PropTypes.array.isRequired,
  isShowReloadPage: PropTypes.bool,
  isShowRefreshPage: PropTypes.bool,
}

