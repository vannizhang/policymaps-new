type ContentType = 'maps' | 'layers' | 'apps' | 'tools' | 'files';
type SortField = 'relevance' | 'name' | 'modified';
type DateFilter = '';

interface QueryParams {
    start: number;
    searchTerm: string;
    contentType: ContentType | '';
    sortField: SortField | '';
    date?: DateFilter; 
    isEsriOnlyContent?: boolean;
    isAuthoritativeOnly?: boolean;
};

interface SearchResponse {
    results: AgolItem[];
    nextStart: number;
};

interface AgolItem {
    title: string;
    type: string;
    owner?: string;
    typeKeywords?: string[];
    description?: string;
    snippet?: string;
    documentation?: string;
    extent?: number[][];
    categories?: string[];
    culture?: string;
    properties?: any;
    url?: string;
    tags?: string[];
    thumbnail?: string;
    [key: string]: any;
};

interface CategorySchemaDataItem {
    title: string;
    categories: CategorySchemaMainCategory[];
    selected?: boolean;
};

interface CategorySchemaMainCategory {
    title: string;
    categories: CategorySchemaSubCategory[];
    selected?: boolean;
};

interface CategorySchemaSubCategory {
    title: string;
    categories: []
};

interface Props {
    groupId: string;
    categorySchema: CategorySchemaDataItem;
    agolHost?: string;
};

export default class AgolGroupData { 
    private AgolGroupId: string;
    private AgolHost: string;
    private categorySchema: CategorySchemaDataItem;

    private queryParams:QueryParams = {
        start: 1,
        searchTerm: '',
        contentType: '',
        sortField: '',
        // date: '',
        // isEsriOnlyContent: false,
        // isAuthoritativeOnly: false,
        // categories: []
    };

    constructor(props: Props){
        this.AgolGroupId = props.groupId;
        this.AgolHost = props.agolHost || 'https://www.arcgis.com';
        this.categorySchema = props.categorySchema;
    };

    updateStart(val?:number){
        this.queryParams.start = val;
    };

    updateSearchTerm(val=''){
        val = val.length <= 250 ? val : val.substring(0, 250);
        this.queryParams.searchTerm = val; 
    };

    updateContentType(val?:ContentType){
        this.queryParams.contentType = val;
    };

    updateSortField(val?:SortField){
        this.queryParams.sortField = val;
    };

    updateSelectedCategory(){

    }

    // updateDate(val?:DateFilter){
    //     this.queryParams.date = val;
    // };

    // updateIsEsriOnlyContent(val:boolean){
    //     this.queryParams.isEsriOnlyContent = val;
    // };

    // updateIsAuthoritativeOnly(val:boolean){
    //     this.queryParams.isAuthoritativeOnly = val;
    // };

    async search(): Promise<SearchResponse>{
        return null;
    };

    async searchNextSet(num=10): Promise<SearchResponse>{
        return null;
    };

    private getQueryParamsString():string{
        return '';
    };

};