import axios from 'axios';
import { queryItemsByIds, queryItemsByCategory } from './queryItems';

export { queryItemsByIds, queryItemsByCategory };

export type ContentType = 'maps' | 'layers' | 'apps' | 'tools' | 'files' | 'webmap';
export type SortField = 'relevance' | 'name' | 'modified';
export type DateFilter = '';

interface Props {
    groupId: string;
    categorySchema: CategorySchemaDataItem;
    agolHost?: string;
    // default query params
    filters?: Filters; 
};

interface Filters {
    searchTerm?: string;
    contentType?: ContentType | '';
    sortField?: SortField | '';
    date?: DateFilter; 
    isEsriOnlyContent?: boolean;
    isAuthoritativeOnly?: boolean;
};

interface CategorySchemaDataItem {
    title: string;
    categories: CategorySchemaMainCategory[];
};

interface CategorySchemaMainCategory {
    title: string;
    categories: CategorySchemaSubCategory[];
    selected?: boolean;
};

interface CategorySchemaSubCategory {
    title: string;
    categories: [];
    selected?: boolean;
};

export interface AgolItem {
    id: string;
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
    groupCategories?: string[];
    [key: string]: any;
};

export interface SearchResponse {
    query: string;
    total: number;
    start: number;
    num: number;
    nextStart: number;
    results: AgolItem[];
};

export const getUrlForSearchOperation = (agolGroupId:string, agolHost='https://www.arcgis.com'): string=>{
    const requestURL = `${agolHost}/sharing/rest/content/groups/${agolGroupId}/search`;
    return requestURL;
}

export default class GroupData { 
    private AgolGroupId: string;
    private AgolHost: string;
    private categorySchema: CategorySchemaDataItem;
    private filters:Filters;

    constructor(props: Props){
        this.AgolGroupId = props.groupId;
        this.AgolHost = props.agolHost || 'https://www.arcgis.com';
        this.categorySchema = props.categorySchema;

        this.filters = props.filters || {
            searchTerm: '',
            contentType: '',
            sortField: 'modified',
        } as Filters
    };

    updateSearchTerm(val=''){
        val = val.length <= 250 ? val : val.substring(0, 250);
        this.filters.searchTerm = val; 
    };

    updateContentType(val?:ContentType){
        this.filters.contentType = val || '';
    };

    updateSortField(val?:SortField){
        this.filters.sortField = val;
    };

    updateSelectedCategory(titleForSelectedMainCategory?:string, titlesForSelectedSubCategories?:string[]){

        this.categorySchema.categories.forEach(mainCategory=>{
            mainCategory.selected = ( titleForSelectedMainCategory && titleForSelectedMainCategory === mainCategory.title )
                ? true 
                : false;

            mainCategory.categories.forEach(subcategory=>{

                subcategory.selected = ( 
                        titlesForSelectedSubCategories && 
                        titlesForSelectedSubCategories.indexOf(subcategory.title) > -1 ) 
                    ? true 
                    : false;
            });
        });

    };

    selectAllSubcategories(){
        const selectedMainCategory = this.categorySchema.categories
        .filter(mainCategory=>{ 
            return mainCategory.selected;
        })[0];

        selectedMainCategory.categories.forEach(subcategory=>{
            subcategory.selected = true;
        })
    }

    encodeSelectedCategory(){
        const selectedMainCategory = this.categorySchema.categories
            .filter(mainCategory=>{ 
                return mainCategory.selected;
            })[0];

        const selectedSubCategories = selectedMainCategory.categories
            .filter(subcategory=>{ 
                return subcategory.selected === true; 
            });

        if(selectedSubCategories.length === selectedMainCategory.categories.length){
            return selectedMainCategory.title
        }

        return `${selectedMainCategory.title}:${selectedSubCategories[0].title}`
    }

    getCategoryPath(mainCategoryOnly=false){

        const selectedMainCategory = this.categorySchema.categories
            .filter(mainCategory=>{ 
                return mainCategory.selected;
            })[0];
        
        // return the root name is no catgegory is selected
        if(!selectedMainCategory){
            return `/${this.categorySchema.title}`;
        };

        if(mainCategoryOnly){
            return `/${this.categorySchema.title}/${selectedMainCategory.title}`;
        }

        const selectedSubCategories = selectedMainCategory.categories
            .filter(subcategory=>{ 
                return subcategory.selected === true; 
            });
        
        // return the path for selected main category if all of it's sub categories are selcted
        if(selectedSubCategories.length === selectedMainCategory.categories.length){
            return `/${this.categorySchema.title}/${selectedMainCategory.title}`;
        } 

        // return concat paths for selected subcategory 
        const outputCategoryPath = selectedSubCategories
            // the group search has the limit of max category size of '8', means it can only have 8 'OR' selections for category searches, therefore we need to trunc the array 
            // to make sure there are no more than 8 items in it
            .slice(0, 8) 
            .map(subCategroy=>{
                return `/${this.categorySchema.title}/${selectedMainCategory.title}/${subCategroy.title}`;
            }).join(',');

        return outputCategoryPath;

    };

    private getContentTypeStr(): string {

        const { contentType } = this.filters;

        const lookup = {
            "maps": '(type:("Project Package" OR "Windows Mobile Package" OR "Map Package" OR "Basemap Package" OR "Mobile Basemap Package" OR "Mobile Map Package" OR "Pro Map" OR "Project Package" OR "Web Map" OR "CityEngine Web Scene" OR "Map Document" OR "Globe Document" OR "Scene Document" OR "Published Map" OR "Explorer Map" OR "ArcPad Package" OR "Map Template") -type:("Web Mapping Application" OR "Layer Package"))',
            "layers": '((type:"Scene Service" OR type:"Feature Collection" OR type:"Route Layer" OR type:"Layer" OR type:"Explorer Layer" OR type:"Tile Package" OR type:"Compact Tile Package" OR type:"Vector Tile Package" OR type:"Scene Package" OR type:"Layer Package" OR type:"Feature Service" OR type:"Stream Service" OR type:"Map Service" OR type:"Vector Tile Service" OR type:"Image Service" OR type:"WMS" OR type:"WFS" OR type:"WMTS" OR type:"KML" OR typekeywords:"OGC" OR typekeywords:"Geodata Service" OR type:"Globe Service" OR type:"CSV" OR type:"Shapefile" OR type:"GeoJson" OR type:"Service Definition" OR type:"File Geodatabase" OR type:"CAD Drawing" OR type:"Relational Database Connection") -type:("Web Mapping Application" OR "Geodata Service"))',
            "apps": '(type:("Code Sample" OR "Web Mapping Application" OR "Mobile Application" OR "Application" OR "Desktop Application Template" OR "Desktop Application" OR "Operation View" OR "Dashboard" OR "Operations Dashboard Extension" OR "Workforce Project" OR "Insights Workbook" OR "Insights Page" OR "Insights Model" OR "Hub Page" OR "Hub Initiative" OR "Hub Site Application"))',
            "files": '((typekeywords:"Document" OR type:"Image" OR type:"Layout" OR type:"Desktop Style" OR type:"Project Template" OR type:"Report Template" OR type:"Statistical Data Collection" OR type:"360 VR Experience" OR type:"netCDF") -type:("Map Document" OR "Image Service" OR "Explorer Document" OR "Explorer Map" OR "Globe Document" OR "Scene Document"))',
            "webmap": '(type:("Web Map") -type:"Web Mapping Application")'
        };

        return lookup[contentType] || '';
    };

    private getSearchTerm(): string {
        const { 
            searchTerm,
        } = this.filters;

        if(!searchTerm){
            return ''
        };

        const cleanedSearchTerm = searchTerm
            .replace(/[!@#\$%\^&\*\(\)\{\}\?<>\+:;",\.\\]/g,'')
            .replace(/\s+/g, ' ');

        return `(${cleanedSearchTerm})`
    }

    private getQueryString(): string {

        const searchTerm = this.getSearchTerm()

        const contentTypeStr = this.getContentTypeStr();

        return [searchTerm, contentTypeStr]
            .filter(str=>str)
            .join(' ');
    };

    private getSortStr(): {
        sortField: string,
        sortOrder: string
    }{

        const { sortField } = this.filters;

        const lookup = {
            'relevance': {
                sortOrder: 'desc'
            },
            'modified': {
                sortOrder: 'desc'
            },
            'title': {
                sortOrder: 'asc'
            },
        };

        return {
            sortField: sortField || 'relevance',
            sortOrder: lookup[sortField] ? lookup[sortField].sortOrder : 'desc'
        };

    }

    private getQueryParams({
        start = 1,
        num = 10,
        searchAlternative = false
    }={}): string{

        // only need to use search term when search for alternative items 
        const q = !searchAlternative 
            ? this.getQueryString()
            : this.getSearchTerm();

            // only use main category when search for alternative items
        const categories = this.getCategoryPath(searchAlternative);

        const { sortField, sortOrder } = this.getSortStr()

        const params = {
            f: 'json',
            start: !searchAlternative ? start : 1,
            num: !searchAlternative ? num : 0,
            q,
            categories,
            sortField,
            sortOrder
        };

        const paramsStr = Object.keys(params).map(key=>{
            return `${key}=${params[key]}`;
        }).join('&');

        return paramsStr;
    };

    async search({
        start = 1,
        num = 10,
        searchAlternative = false
    }={}): Promise<SearchResponse>{

        const params = this.getQueryParams({ start, num, searchAlternative });

        const urlForSearchOperation = getUrlForSearchOperation(this.AgolGroupId, this.AgolHost)

        const requestURL = `${urlForSearchOperation}?${params}`;

        const { data } = await axios.get<SearchResponse>(requestURL);
        // console.log(data);

        return data;
    };

    getCurrentFilterValues(){

        const {
            searchTerm,
            contentType,
            sortField
        } = this.filters;

        const categories = this.encodeSelectedCategory();

        return {
            searchTerm,
            contentType,
            sortField,
            categories
        }
    }

};