// CloudFront Function (viewer request, runtime cloudfront-js-2.0): serves the prerendered page of a path.
// A path without a file extension is a page: it gets the index.html of its first segment, so `/en/` and
// `/en/anything` get `/en/index.html` and `/` gets `/index.html`. A first segment without a page (`/foo/`) finds
// no file and falls back to `/index.html` through the error responses of the distribution.
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    var lastSegment = uri.substring(uri.lastIndexOf('/') + 1);
    if (lastSegment.indexOf('.') === -1) {
        var firstSegment = uri.split('/')[1];
        request.uri = firstSegment ? '/' + firstSegment + '/index.html' : '/index.html';
    }
    return request;
}
