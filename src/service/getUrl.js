export const apiUrl = "https://mb.mahidol.ac.th/seapi/";
//export const apiUrl = "http://localhost:9200/";

const getUrl = (type) => {
    let url = "";
    if (type === "mu_auth") url = "http://localhost:3000";  // mahidol
    // if (type === "mu_auth") url = "https://mb.mahidol.ac.th/mbenter";  // mahidol

    if (type === "api") url = "https://mb.mahidol.ac.th/seapi/";  // backend
    //if (type === "api") url = "http://localhost:9200/login";  // backend seagames
    //console.log('url : ', url)
    return url;
}
export const getWebUrl = getUrl;
