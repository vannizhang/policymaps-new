import './style.scss';
import * as React from 'react';
import { stringFns } from 'helper-toolkit-ts';

import {
    getSearchSuggest,
    SuggestResult
} from './arcgis-online-suggest-api';

interface Props {
    groupId: string;
    agolHost?: string;
    placeholder?: string;
    // type:"web map"
    filters?: string;
    deafultVal?: string;

    onSelect?: (val:string)=>void;
}

const SearchAutoComplete:React.FC<Props> = ({
    groupId,
    agolHost = 'https://www.arcgis.com',
    placeholder = 'Search items',
    deafultVal='',
    filters = '',
    onSelect
})=>{

    const containerRef = React.useRef<HTMLDivElement>();

    const [ searchTerm, setSearchTerm ] = React.useState<string>(deafultVal);
    const [ suggestions, setSuggestions ] = React.useState<SuggestResult[]>([]);
    const [ suggestionCandidateIndex, setSuggestionCandidateIndex] = React.useState<number>(-1);

    const searchSuggestions = async(val='')=>{

        try {

            const res = await getSearchSuggest({
                searchTerm: val,
                groupId,
                agolHost,
                filters
            });

            const results = res && res.results || [];
            console.log('searchSuggestions results', results);

            setSuggestions(results);

        } catch(err){
            console.error(err);
            setSuggestions([])
        }
    };

    const suggestionOnSelect = (val='')=>{
        console.log(val);

        if(onSelect){
            onSelect(val);
        }

        setSearchTerm(val);
        setSuggestions([]);
        setSuggestionCandidateIndex(-1);
    }

    const searchInputOnChange = (event:React.ChangeEvent<HTMLInputElement>)=>{

        const inputVal = event.target.value;

        setSearchTerm(inputVal);

        searchSuggestions(inputVal);
    };

    const searchInputOnKeyDown = (event:React.KeyboardEvent<HTMLInputElement>)=>{

        if(event.key === 'ArrowDown'){

            const newCandidateIndex = suggestionCandidateIndex + 1 < suggestions.length 
                ? suggestionCandidateIndex + 1 
                : -1;

            setSuggestionCandidateIndex(newCandidateIndex);

        } else if (event.key === 'ArrowUp'){

            const newCandidateIndex = suggestionCandidateIndex - 1 >= -1 
                ? suggestionCandidateIndex - 1 
                : suggestions.length - 1;

            setSuggestionCandidateIndex(newCandidateIndex);

        } else if(event.key === 'Enter') {

            const val = (suggestionCandidateIndex !== -1) 
                ? `"${suggestions[suggestionCandidateIndex].title}"` // wrap the suggestion in quotes
                : searchTerm;

            suggestionOnSelect(val);

        } else {
            // do nothing
        }
    };

    const getLabelForSuggestionItem = (title:string)=>{

        if(stringFns.hasHtmlTag(title)){
            title = stringFns.stripHtmlTag(title);
        }

        const idxOfVal = title.toLowerCase().indexOf(searchTerm.toLowerCase().trim());

        if(idxOfVal === -1){
            return <span>{title}</span>;
        } 

        const valInItemTitle = title.substring(idxOfVal, idxOfVal + searchTerm.length)
        const stringBeforeVal = title.substring(0, idxOfVal);
        const stringAfterValue = title.substring(idxOfVal + searchTerm.length);

        return (
            <span> 
                { stringBeforeVal }
                <span className='avenir-bold'>{valInItemTitle}</span>
                { stringAfterValue }
            </span>
        );
    };

    const getSuggestionList = ():JSX.Element =>{

        if(!suggestions || !suggestions.length){
            return null;
        }

        const suggestionListItems = suggestions.map((d, i)=>{
            const { title, id } = d;

            const isActiveCandidate = suggestionCandidateIndex === i 
                ? 'is-active-condidate' 
                : '';

            const label = getLabelForSuggestionItem(title);
            // const iconUrl = getIconUrl(d.type, d.typeKeywords);

            return (
                <div key={`suggestion-item-${id}`} 
                    className={`suggestion-item font-size--2 ${isActiveCandidate}`} 
                    onClick={suggestionOnSelect.bind(this, `"${title}"`)} // wrap the suggestion in quotes
                >
                    {/* <img className="item-type-icon margin-right-half" src={iconUrl}></img> */}
                    {label}
                </div>
            )
        });

        return (
            <div className='search-suggestion-wrap'>
                <div className='search-suggestion-list'>
                    {suggestionListItems}
                </div>  
            </div>
        );
    };

    const getClearBtn = ():JSX.Element =>{

        if(!searchTerm){
            return null;
        }

        return (
            <div 
                className={'clear-btn'}
                style={{ 'cursor': 'pointer' }}
                onClick={suggestionOnSelect.bind(this, '')}
            >
                <span className='icon-ui-close text-red'></span>
            </div>
        );
    };

    React.useEffect(()=>{
        // console.log('search term on update', searchTerm);
    }, [ searchTerm ]);

    return (
        <div className='agol-group-data-search-autocomplete' ref={containerRef}>

            <div className="search-input-wrap">

                <div className="input-group">
                    <input 
                        className="input-group-input input-minimal" 
                        type="text" 
                        autoComplete="off" 
                        placeholder={placeholder} 
                        value={searchTerm} 
                        onChange={searchInputOnChange}
                        onKeyDown={searchInputOnKeyDown}
                    />

                </div>

                { getClearBtn() }

            </div>

            { getSuggestionList() }

        </div>
    );
};

export default SearchAutoComplete;