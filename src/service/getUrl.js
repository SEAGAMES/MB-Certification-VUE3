// export const apiUrl = "http://10.20.5.205:9200/";
export const apiUrl = "https://mb.mahidol.ac.th/seapi/";
//export const apiUrl = "http://localhost:9200/";
//export const apiUrl = "http://10.62.38.51:9200/";

const getUrl = (type) => {
    let url = "";
    // if (type === "mu_auth") url = "http://10.20.5.199:4000";  // mahidol
    // if (type === "api") url = "http://10.20.5.199:9100";  // backend

    if (type === "mu_auth") url = "https://mb.mahidol.ac.th/mbenter";  // mahidol
    if (type === "api") url = "https://mb.mahidol.ac.th/seapi/";  // backend
    //console.log('url : ', url)
    return url;
}
export const getWebUrl = getUrl;
//export const apiUrl = getUrl;