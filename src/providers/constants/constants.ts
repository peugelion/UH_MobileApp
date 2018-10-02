
//export const STRAPI_ENDPOINT = 'http://localhost:1337';
//export const STRAPI_ENDPOINT = window.location.protocol + '//' + window.location.hostname;
//export const STRAPI_ENDPOINT = (window.location.hostname == "localhost") ? 'http://localhost:1337' : window.location.origin; // public url works on port 80
export const STRAPI_ENDPOINT = (window.location.hostname == "localhost") ? 'http://localhost:1337' : 'https://uhstrapi.app.sajtweb.net'; // public url works on port 80 .. hardcoded for now

export const DATE_TIME_FMT= `short`;
export const DATE_FMT= `date`;
// export class Constants {
//     //static readonly DATE_FMT = 'dd/MMM/yyyy';
//     //static readonly DATE_TIME_FMT = `${Constants.DATE_FMT} hh:mm:ss`;
//     static readonly DATE_TIME_FMT = `short`;
// }