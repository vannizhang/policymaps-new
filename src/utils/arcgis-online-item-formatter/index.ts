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
    groupCategories?: string[];
    culture?: string;
    properties?: any;
    url?: string;
    tags?: string[];
    thumbnail?: string;
    isSubscriberContent?: boolean;
    isPremiumContent?: boolean;
    isAuthoritative?: boolean;
    thumbnailUrl?: string;
    agolItemUrl?: string;
    itemIconUrl?: string;
    typeDisplayName?: string;
    [key: string]: any;
};

export const formatAsAgolItem = (item:AgolItem, {
    agolHost = 'https://www.arcgis.com',
    thumbnailWidth = 200
}={})=>{
    if(!item){
        return null;
    }

    const typeKeywords = item.typeKeywords || [];
    const contentStatus = item.contentStatus || '';

    item.isSubscriberContent = isSubscriberContent(typeKeywords);

    item.isPremiumContent = isPremiumContent(typeKeywords);

    item.isAuthoritative = isAuthoritative(contentStatus);

    item.thumbnailUrl = getThumbnailUrl({
        thumbnail: item.thumbnail,
        itemId: item.id,
        agolHost,
        width: thumbnailWidth
    });

    item.agolItemUrl = getAgolItemUrl(item.id, agolHost);

    item.itemIconUrl = getIconUrl(item.type, item.typeKeywords);

    item.typeDisplayName = getDisplayName(item.type, item.typeKeywords);

    item.url = getUrl(item);

    return item;
};

const getUrl = (item:AgolItem, agolHost = 'https://www.arcgis.com')=>{

    const { url, id, typeDisplayName } = item;

    if(url){
        return url
    };

    const urlAgolItemPage = `${agolHost}/home/item.html?id=${id}`;
    const urlForWebmap = `${agolHost}/home/webmap/viewer.html?webmap=${id}`;
    const urlForPdfFile = `${agolHost}/sharing/rest/content/items/${id}/data`;
    const urlForLayer = `${agolHost}/home/webmap/viewer.html?useExisting=1&layers=${id}`;
    const urlForDashboard = `${agolHost}/apps/opsdashboard/index.html#/${id}`;

    const urlByContentType = {
        'Web Map': urlForWebmap,
        'PDF': urlForPdfFile,
        'Feature Layer': urlForLayer,
        'Tile Layer': urlForLayer,
        'Imagery Layer': urlForLayer,
        'Map Image Layer': urlForLayer,
        'Dashboard': urlForDashboard
    };

    return urlByContentType[typeDisplayName] || urlAgolItemPage;
}

const getAgolItemUrl = (itemId='', agolHost='https://www.arcgis.com')=>{
    // agolHost = agolHost || 'https://www.arcgis.com';
    return agolHost + "/home/item.html?id=" + itemId;
};

const getThumbnailUrl = ({
    thumbnail='',
    itemId='',
    agolHost='https://www.arcgis.com',
    width=200
}={})=>{
    
    if(!thumbnail || !itemId){
        return '//static.arcgis.com/images/desktopapp.png';
    }

    const host = agolHost || "//www.arcgis.com";

    const thumbnailUrl = `${host}/sharing/content/items/${itemId}/info/${thumbnail}?w=${width}`;

    return thumbnailUrl;
};

const isSubscriberContent = (typeKeywords: string[])=>{
    return ( typeKeywords.indexOf("Requires Subscription") >= 0 ) ? true : false; 
};

const isPremiumContent = (typeKeywords: string[])=>{
    return ( typeKeywords.indexOf("Requires Credits") >= 0 ) ? true : false; 
};

const isAuthoritative = (contentStatus='')=>{
    return ( contentStatus === 'public_authoritative' ) ? true : false; 
};

const getDisplayName = (itemType = '', typeKeywords: string[]) => {
    let displayName = itemType;
   
    if (itemType === "Feature Service" || itemType === "Feature Collection") {
        displayName =
        typeKeywords.indexOf("Table") > -1 ?
        "Table" :
        typeKeywords.indexOf("Route Layer") > -1 ?
        "Route Layer" :
        typeKeywords.indexOf("Markup") > -1 ?
        "Markup" :
        "Feature Layer";
    } else if (itemType === "Image Service") {
        displayName = typeKeywords.indexOf("Elevation 3D Layer") > -1 ? "Elevation Layer" : "Imagery Layer";
    } else if (itemType === "Scene Service") {
        displayName = "Scene Layer";
    } else if (itemType === "Scene Package") {
        displayName = "Scene Layer Package";
    } else if (itemType === "Stream Service") {
        displayName = "Feature Layer";
    } 
    // else if (itemType === "Geoprocessing Service" && (this.portal && this.portal.isPortal)) {
    //     displayName = typeKeywords.indexOf("Web Tool") > -1 ? "Tool" : "Geoprocessing Service";
    // } 
    else if (itemType === "Geocoding Service") {
        displayName = "Locator";
    } else if (itemType === "Microsoft Powerpoint") {
        // Unfortunately this was named incorrectly on server side, changing it there would result in some issues
        displayName = "Microsoft PowerPoint";
    } else if (itemType === "GeoJson") {
        // Unfortunately this was named incorrectly on server side, changing it there would result in some issues
        displayName = "GeoJSON";
    } else if (itemType === "Globe Service") {
        displayName = "Globe Layer";
    } else if (itemType === "Vector Tile Service") {
        displayName = "Tile Layer";
    } else if (itemType === "netCDF") {
        displayName = "NetCDF";
    } else if (itemType === "Map Service") {
        if (
        typeKeywords.indexOf("Spatiotemporal") === -1 &&
        (typeKeywords.indexOf("Hosted Service") > -1 || typeKeywords.indexOf("Tiled") > -1) &&
        typeKeywords.indexOf("Relational") === -1
        ) {
        displayName = "Tile Layer";
        } else {
        displayName = "Map Image Layer";
        }
    } else if (itemType && itemType.toLowerCase().indexOf("add in") > -1) {
        displayName = itemType.replace(/(add in)/gi, "Add-In");
    } else if (itemType === "datastore catalog service") {
        displayName = "Big Data File Share";
    } else if (itemType === "Compact Tile Package") {
        displayName = "Tile Package (tpkx)";
    }
   
    return displayName;
};
   
const getIconUrl = (type = '', typeKeywords: string[]) => {
    const itemType = (type && type.toLowerCase()) || "";
    // const imgDir = "../images/portal/";
    const size = "16"; //for now we only support 16x16 pixel images

    let imgName = '';
    let isHosted = false;
    let isTable = false;
    let isRouteLayer = false;
    let isMarkupLayer = false;
    let isSpatiotemporal = false;

    if (
        itemType.indexOf("service") > 0 ||
        itemType === "feature collection" ||
        itemType === "kml" ||
        itemType === "wms" ||
        itemType === "wmts" ||
        itemType === "wfs"
    ) {
        isHosted = typeKeywords.indexOf("Hosted Service") > -1;
        if (
        itemType === "feature service" ||
        itemType === "feature collection" ||
        itemType === "kml" ||
        itemType === "wfs"
        ) {
        isTable = typeKeywords.indexOf("Table") > -1;
        isRouteLayer = typeKeywords.indexOf("Route Layer") > -1;
        isMarkupLayer = typeKeywords.indexOf("Markup") > -1;
        isSpatiotemporal = typeKeywords.indexOf("Spatiotemporal") !== -1;
        imgName =
        isSpatiotemporal && isTable ?
        "spatiotemporaltable" :
        isTable ?
        "table" :
        isRouteLayer ?
        "routelayer" :
        isMarkupLayer ?
        "markup" :
        isSpatiotemporal ?
        "spatiotemporal" :
        isHosted ?
        "featureshosted" :
        "features";
        } else if (itemType === "map service" || itemType === "wms" || itemType === "wmts") {
        isSpatiotemporal = typeKeywords.indexOf("Spatiotemporal") !== -1;
        imgName =
        isHosted || typeKeywords.indexOf("Tiled") > -1 || itemType === "wmts" ?
        "maptiles" :
        isSpatiotemporal ?
        "spatiotemporal" :
        "mapimages";
        } else if (itemType === "scene service") {
        if (typeKeywords.indexOf("Line") > -1) {
        imgName = "sceneweblayerline";
        } else if (typeKeywords.indexOf("3DObject") > -1) {
        imgName = "sceneweblayermultipatch";
        } else if (typeKeywords.indexOf("Point") > -1) {
        imgName = "sceneweblayerpoint";
        } else if (typeKeywords.indexOf("IntegratedMesh") > -1) {
        imgName = "sceneweblayermesh";
        } else if (typeKeywords.indexOf("PointCloud") > -1) {
        imgName = "sceneweblayerpointcloud";
        } else if (typeKeywords.indexOf("Polygon") > -1) {
        imgName = "sceneweblayerpolygon";
        } else if (typeKeywords.indexOf("Building") > -1) {
        imgName = "sceneweblayerbuilding";
        } else {
        imgName = "sceneweblayer";
        }
        } else if (itemType === "image service") {
        imgName = typeKeywords.indexOf("Elevation 3D Layer") > -1 ? "elevationlayer" : "imagery";
        } else if (itemType === "stream service") {
        imgName = "streamlayer";
        } else if (itemType === "vector tile service") {
        imgName = "vectortile";
        } else if (itemType === "datastore catalog service") {
        imgName = "datastorecollection";
        } else if (itemType === "geocoding service") {
        imgName = "geocodeservice";
        } 
        // else if (itemType === "geoprocessing service") {
        // imgName = typeKeywords.indexOf("Web Tool") > -1 && (this.portal && this.portal.isPortal) ? "tool" : "layers";
        // } 
        else {
        imgName = "layers";
        }
    } else if (itemType === "web map" || itemType === "cityengine web scene") {
        imgName = "maps";
    } else if (itemType === "web scene") {
        imgName = typeKeywords.indexOf("ViewingMode-Local") > -1 ? "webscenelocal" : "websceneglobal";
    } else if (
        itemType === "web mapping application" ||
        itemType === "mobile application" ||
        itemType === "application" ||
        itemType === "operation view" ||
        itemType === "desktop application"
    ) {
        imgName = "apps";
    } else if (
        itemType === "map document" ||
        itemType === "map package" ||
        itemType === "published map" ||
        itemType === "scene document" ||
        itemType === "globe document" ||
        itemType === "basemap package" ||
        itemType === "mobile basemap package" ||
        itemType === "mobile map package" ||
        itemType === "project package" ||
        itemType === "project template" ||
        itemType === "pro map" ||
        itemType === "layout" ||
        (itemType === "layer" && typeKeywords.indexOf("ArcGIS Pro") > -1) ||
        (itemType === "explorer map" && typeKeywords.indexOf("Explorer Document"))
    ) {
        imgName = "mapsgray";
    } else if (
        itemType === "service definition" ||
        itemType === "csv" ||
        itemType === "shapefile" ||
        itemType === "cad drawing" ||
        itemType === "geojson" ||
        itemType === "360 vr experience" ||
        itemType === "netcdf"
    ) {
        imgName = "datafiles";
    } else if (
        itemType === "explorer add in" ||
        itemType === "desktop add in" ||
        itemType === "windows viewer add in" ||
        itemType === "windows viewer configuration"
    ) {
        imgName = "appsgray";
    } else if (itemType === "arcgis pro add in" || itemType === "arcgis pro configuration") {
        imgName = "addindesktop";
    } else if (
        itemType === "rule package" ||
        itemType === "file geodatabase" ||
        itemType === "sqlite geodatabase" ||
        itemType === "csv collection" ||
        itemType === "kml collection" ||
        itemType === "windows mobile package" ||
        itemType === "map template" ||
        itemType === "desktop application template" ||
        itemType === "arcpad package" ||
        itemType === "code sample" ||
        itemType === "form" ||
        itemType === "document link" ||
        itemType === "operations dashboard add in" ||
        itemType === "rules package" ||
        itemType === "image" ||
        itemType === "workflow manager package" ||
        ((itemType === "explorer map" && typeKeywords.indexOf("Explorer Mapping Application") > -1) ||
        typeKeywords.indexOf("Document") > -1)
    ) {
        imgName = "datafilesgray";
    } else if (
        itemType === "network analysis service" ||
        itemType === "geoprocessing service" ||
        itemType === "geodata service" ||
        itemType === "geometry service" ||
        itemType === "geoprocessing package" ||
        itemType === "locator package" ||
        itemType === "geoprocessing sample" ||
        itemType === "workflow manager service"
    ) {
        imgName = "toolsgray";
    } else if (itemType === "layer" || itemType === "layer package" || itemType === "explorer layer") {
        imgName = "layersgray";
    } else if (itemType === "scene package") {
        imgName = "scenepackage";
    } else if (itemType === "mobile scene package") {
        imgName = "mobilescenepackage";
    } else if (itemType === "tile package" || itemType === "compact tile package") {
        imgName = "tilepackage";
    } else if (itemType === "task file") {
        imgName = "taskfile";
    } else if (itemType === "report template") {
        imgName = "report-template";
    } else if (itemType === "statistical data collection") {
        imgName = "statisticaldatacollection";
    } else if (itemType === "insights workbook") {
        imgName = "workbook";
    } else if (itemType === "insights model") {
        imgName = "insightsmodel";
    } else if (itemType === "insights page") {
        imgName = "insightspage";
    } else if (itemType === "insights theme") {
        imgName = "insightstheme";
    } else if (itemType === "hub initiative") {
        imgName = "hubinitiative";
    } else if (itemType === "hubpage") {
        imgName = "hubpage";
    } else if (itemType === "hub site application") {
        imgName = "hubsite";
    } else if (itemType === "relational database connection") {
        imgName = "relationaldatabaseconnection";
    } else if (itemType === "big data file share") {
        imgName = "datastorecollection";
    } else if (itemType === "image collection") {
        imgName = "imagecollection";
    } else if (itemType === "style") {
        imgName = "style";
    } else if (itemType === "desktop style") {
        imgName = "desktopstyle";
    } else if (itemType === "dashboard") {
        imgName = "dashboard";
    } else if (itemType === "raster function template") {
        imgName = "rasterprocessingtemplate";
    } else if (itemType === "vector tile package") {
        imgName = "vectortilepackage";
    } else if (itemType === "ortho mapping project") {
        imgName = "orthomappingproject";
    } else if (itemType === "ortho mapping template") {
        imgName = "orthomappingtemplate";
    } else if (itemType === "solution") {
        imgName = "solutions";
    } else if (itemType === "geopackage") {
        imgName = "geopackage";
    } else if (itemType === "deep learning package") {
        imgName = "deeplearningpackage";
    } else if (itemType === "real time analytic") {
        imgName = "realtimeanalytics";
    } else if (itemType === "big data analytic") {
        imgName = "bigdataanalytics";
    } else if (itemType === "feed") {
        imgName = "feed";
    } else if (itemType === "excalibur imagery project") {
        imgName = "excaliburimageryproject";
    } else if (itemType === "notebook") {
        imgName = "notebook";
    } else if (itemType === "storymap") {
        imgName = "storymap";
    } else if (itemType === "survey123 add in") {
        imgName = "survey123addin";
    } else if (itemType === "mission") {
        imgName = "mission";
    } else if (itemType === "quickcapture project") {
        imgName = "quickcaptureproject";
    } else if (itemType === "pro report") {
        imgName = "proreport";
    } else if (itemType === "urban model") {
        imgName = "urbanmodel";
    } else if (itemType === "web experience") {
        imgName = "experiencebuilder";
    } else {
        imgName = "maps";
    }

    return imgName ? `//arcgis.com/home/js/arcgisonline/img/item-types/${imgName}${size}.svg` : null;
};