import {
    createSlice,
    createSelector,
    PayloadAction,
    // createAsyncThunk,
} from '@reduxjs/toolkit';

// import { batch } from 'react-redux';

import { RootState, StoreDispatch, StoreGetState } from '../configureStore';

import {
    searchGroupItems,
    ContentType,
    SearchResponse,
    SortField,
    SortOrder,
    AgolItem,
} from '@vannizhang/arcgis-rest-helper';

// no need to keep results in the "searchResult" state, as the results will be saved in "items" state.
export type SearchResult = Omit<SearchResponse, 'results'>;

export type Category = {
    // selected main category
    mainCategory: string;
    // selected sub-categories
    subCategories: string[];
};

type Filters = {
    searchTerm: string;
    sort: SortField;
    contentType: ContentType;
    category: Category;
};

export type GroupContentState = {
    items: {
        byId: {
            [key: string]: AgolItem;
        };
        allIds: string[];
    };
    searchResult: SearchResult;
    filters: Filters;
};

const initialState4Filters: Filters = {
    searchTerm: '',
    sort: 'relevance',
    contentType: '',
    category: {
        mainCategory: '',
        subCategories: [],
    },
};

export const initialState4GroupContent = {
    items: {
        byId: {},
        allIds: [],
    },
    searchResult: null,
    filters: initialState4Filters,
} as GroupContentState;

const slice = createSlice({
    name: 'GroupContent',
    initialState: initialState4GroupContent,
    reducers: {
        itemsLoaded: (state, action: PayloadAction<SearchResponse>) => {
            const {
                query,
                total,
                start,
                nextStart,
                num,
                results,
            } = action.payload;

            const allIds: string[] = [...state.items.allIds];

            const byId = {
                ...state.items.byId,
            };

            for (const item of results) {
                const { id } = item;
                allIds.push(id);
                byId[id] = item;
            }

            state.items = {
                allIds,
                byId,
            };

            state.searchResult = {
                query,
                total,
                start,
                nextStart,
                num,
            };
        },
        itemsReset: (state) => {
            state.items.byId = {};
            state.items.allIds = [];
            state.searchResult = null;
        },
        searchTermChanged: (state, action: PayloadAction<string>) => {
            state.filters.searchTerm = action.payload;
        },
        sortFieldChanged: (state, action: PayloadAction<SortField>) => {
            state.filters.sort = action.payload;
        },
        contentTypeChanged: (state, action: PayloadAction<ContentType>) => {
            state.filters.contentType = action.payload;
        },
        categoryChanged: (state, action: PayloadAction<Category>) => {
            state.filters.category = action.payload;
        },
    },
});

const { reducer } = slice;

const {
    itemsLoaded,
    itemsReset,
    searchTermChanged,
    sortFieldChanged,
    categoryChanged,
    contentTypeChanged,
} = slice.actions;

export const updateSearchTerm = (searchTerm: string) => (
    dispatch: StoreDispatch
    // getState: StoreGetState
): void => {
    dispatch(searchTermChanged(searchTerm));
    dispatch(searchItems());
};

export const updateContentType = (contentType: ContentType) => (
    dispatch: StoreDispatch
    // getState: StoreGetState
): void => {
    dispatch(contentTypeChanged(contentType));
    dispatch(searchItems());
};

export const updateCategory = (
    mainCategory: string,
    subCategories: string[] = []
) => (
    dispatch: StoreDispatch
    // getState: StoreGetState
): void => {
    dispatch(
        categoryChanged({
            mainCategory,
            subCategories,
        })
    );
    dispatch(searchItems());
};

export const searchItems = () => async (
    dispatch: StoreDispatch,
    getState: StoreGetState
): Promise<void> => {
    dispatch(itemsReset());

    const { groupContent } = getState();

    const { filters } = groupContent;

    const { searchTerm, sort, contentType, category } = filters;

    // Remove question mark, backslash, and other uncommon special chars from searchTerm
    const searchTermCleaned = searchTerm.replace(/[&:]/g, ' ');

    try {
        const response = await searchGroupItems({
            searchTerm: searchTermCleaned,
            contentType,
            sortField: sort,
            mainCategory: category.mainCategory,
            subCategories: category.subCategories,
        });

        dispatch(itemsLoaded(response));
    } catch (err) {
        console.error(err);
    }
};

// add more items to existing search results
export const loadMoreItems = (num = 10) => async (
    dispatch: StoreDispatch,
    getState: StoreGetState
): Promise<void> => {
    const { groupContent } = getState();

    const { searchResult } = groupContent;

    if (!searchResult || searchResult.nextStart === -1) {
        console.log('no more items to be loaded');
        return;
    }

    const { filters } = groupContent;

    const { searchTerm, sort, contentType, category } = filters;

    try {
        const response = await searchGroupItems({
            start: searchResult.nextStart,
            num,
            searchTerm,
            contentType,
            sortField: sort,
            mainCategory: category.mainCategory,
            subCategories: category.subCategories,
        });

        dispatch(itemsLoaded(response));
    } catch (err) {
        console.error(err);
    }

    // dispatch(itemsLoaded(response));
};

export const itemsSelector = createSelector(
    (state: RootState) => state.groupContent.items,
    ({ byId, allIds }) => {
        return allIds.map((id) => byId[id]);
    }
);

export const searchTermSelector = createSelector(
    (state: RootState) => state.groupContent.filters,
    (filters) => filters.searchTerm
);

export const contentTypeSelector = createSelector(
    (state: RootState) => state.groupContent.filters,
    (filters) => filters.contentType
);

export const categorySelector = createSelector(
    (state: RootState) => state.groupContent.filters,
    (filters) => filters.category
);

export const searchResultSelector = createSelector(
    (state: RootState) => state.groupContent.searchResult,
    (searchResult) => searchResult
);

export default reducer;
