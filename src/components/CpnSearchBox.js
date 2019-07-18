import React, { useState, useEffect, useRef } from 'react';
import CpnIcon from './CpnIcon';

function useOutsideAlerter(ref, func) {
    function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
            func();
        }
    }

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    });
}


// Our hook
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
}

export default function CpnSearchBox(props) {
    const { search } = props;
    const inputEl = useRef(null);
    const [text, setText] = useState('');
    const [isFocus, setIsFocus] = useState(false);
    const [suggests, setSuggests] = useState([]);
    const [isFetchingSuggests, setIsFetchingSuggests] = useState(false);
    const [indexSelect, setIndexSelect] = useState(null);
    const searchRef = useRef(null);
    useOutsideAlerter(searchRef, () => setIsFocus(false));

    const debouncedSearchTerm = useDebounce(text, 500);

    // Effects
    useEffect(() => {
        if (!search || !search.onSuggests || typeof search.onSuggests !== 'function') return;

        if (debouncedSearchTerm) {
            setIsFetchingSuggests(true);

            // Fire off our API call
            const textSearch = inputEl.current.value;
            if (!textSearch) return;
            const callBack = (data) => {
                setSuggests(data || []);
                setIsFetchingSuggests(false);
            }
            search.onSuggests(textSearch, callBack)
        } else {
            // setSuggests([]);
        }
    }, [debouncedSearchTerm, text, search]);

    useEffect(() => {

        if (isFocus) {
            document.onkeydown = (e) => {

                if (e.which === 38) {
                    // Up
                    if (indexSelect === null) return;
                    if (indexSelect === 0) return setIndexSelect(null);
                    setIndexSelect(indexSelect - 1)
                }

                if (e.which === 40) {
                    // Down
                    if (indexSelect === null || indexSelect === suggests.length - 1) return setIndexSelect(0);
                    setIndexSelect(indexSelect + 1)
                }
            }
        } else {
            document.onkeydown = null
        }

        return () => {
            document.onkeydown = null
        }
    }, [isFocus, indexSelect, suggests])

    // Validate props
    const throwError = (msg) => {
        console.error(msg);
        return null;
    }

    if (!search) return <div />;
    if (typeof search.onSubmit !== 'function') return throwError('search -> onSubmit: must be a function (required)');
    if (search.onSuggests && typeof search.onSuggests !== 'function') return throwError(`search -> onSuggests: must be a function`);

    return <form
        ref={searchRef}
        className={`cpn-table--cpn-search-box ${isFetchingSuggests && inputEl.current.value ? 'loading' : ''}`}
        onSubmit={e => {
            e.preventDefault();
            search.onSubmit(suggests[indexSelect])
        }}
        onBlur={() => {
            if (isFocus) return;
            setSuggests([]);
            setText('');
        }}
    >
        <svg viewBox="0 0 55 57" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <g id="Page-1" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
                <g id={149852} transform="translate(-1.000000, 0.000000)" fill="#546E7A" fillRule="nonzero">
                    <path d="M55.146,51.887 L41.588,37.786 C45.074,33.642 46.984,28.428 46.984,23 C46.984,10.318 36.666,0 23.984,0 C11.302,0 0.984,10.318 0.984,23 C0.984,35.682 11.302,46 23.984,46 C28.745,46 33.282,44.564 37.161,41.838 L50.822,56.046 C51.393,56.639 52.161,56.966 52.984,56.966 C53.763,56.966 54.502,56.669 55.063,56.129 C56.255,54.982 56.293,53.08 55.146,51.887 Z M23.984,6 C33.358,6 40.984,13.626 40.984,23 C40.984,32.374 33.358,40 23.984,40 C14.61,40 6.984,32.374 6.984,23 C6.984,13.626 14.61,6 23.984,6 Z" id="Shape" />
                </g>
            </g>
        </svg>
        <input
            onFocus={() => setIsFocus(true)}
            ref={inputEl}
            value={text}
            type="text"
            placeholder="Nhập từ khoá tìm kiếm..."
            onChange={(e) => {
                setText(e.target.value);
            }}
            onBlur={() => {
                setText('');
                setIsFetchingSuggests(false);
                // setIsFocus(false)
            }}
        />

        <div className="icon-loading">
            <CpnIcon name="LOADING-ELLIPSIS" />
        </div>

        {isFocus ? <div className="list-suggests">
            {suggests.map((item, key) => {
                return <div
                    key={key}
                    onMouseEnter={() => {
                        setIndexSelect(null);
                        setIsFocus(true);
                    }}
                    onClick={() => {
                        search.onSubmit(item);
                        // setIsFocus(false);
                        setSuggests([]);
                    }}
                    className={`item ${indexSelect === key ? 'selected' : ''}`}
                >
                    {item.label}
                </div>
            })}
        </div> : null}
    </form>
}