/*
 * ImgLoadingIndicator:
 * 0.1.1
 *
 * By Max Ulyanov
 * Source: https://github.com/M-Ulyanov/ImgLoadingIndicator
 * Example https://m-ulyanov.github.io/ImgLoadingIndicator/
 */


'use strict';


(function() {


    /**
     * 
     * @param options
     * @constructor
     */
    function ImgLoadingIndicator(options) {
        this.options = options;
        this.image = this.options.image;
        this.url = this.image.getAttribute('data-image-loading-url');

        this._indicator = null;
        this._progress = 0;
        this._percent = null;

        if(!this.image.getAttribute('data-image-loading-success') && this.url) {
            this._createRequest();
            this._createIndicator();
        }

    }


    /**
     *
     * @private
     */
    ImgLoadingIndicator.prototype._createRequest = function() {
        var request = new XMLHttpRequest();
        request.onprogress = this._onProgress.bind(this);
        request.onload = this._onComplete.bind(this);
        request.onerror = this._onError.bind(this);

        if(this.url.indexOf('http') === -1) {
            this.url = window.location.protocol + '//' + this.url;
        }

        request.open('GET', this.url, true);
        request.send(null);
    };


    /**
     *
     * @private
     */
    ImgLoadingIndicator.prototype._createIndicator = function() {
        this._indicator = document.createElement('div');
        this._indicator.className = 'container-circular-loader';

        var circlesLength = 8;
        for (var i = 0; i < circlesLength; i++) {
            var circle = document.createElement('div');
            circle.className = 'circle ' + 'circle-index-' + i;
            this._indicator.appendChild(circle);
        }

        var parent = this.image.parentNode;
        parent.appendChild(this._indicator);
        var stylePosition = getComputedStyle(parent).position;
        if(stylePosition === 'static') {
            parent.style.position = 'relative';
        }

        if(this.options.showLoadPercent) {
            this._renderLoadPercentage();
        }

    };


    /**
     *
     * @private
     */
    ImgLoadingIndicator.prototype._removeIndicator = function() {
        this._indicator.parentNode.removeChild(this._indicator);
    };


    /**
     *
     * @private
     */
    ImgLoadingIndicator.prototype._renderLoadPercentage = function() {
        var container = document.createElement('div');
        container.className = 'container-loader-percent';

        this._percent = document.createElement('div');
        this._percent.className = 'loader-percent__text';

        container.appendChild(this._percent);

        this._indicator.appendChild(container);
    };


    /**
     *
     * @private
     */
    ImgLoadingIndicator.prototype._updateLoadPercentage = function() {
        this._percent.innerHTML = this._progress;
    };


    /**
     *
     * @param type
     * @param event
     * @private
     */
    ImgLoadingIndicator.prototype._callbacksController = function(type, event) {
        var currentCallback = null;

        switch (type) {
            case 'complete':
                currentCallback = this.options.callbacks.complete;
                break;
            case 'progress':
                currentCallback = this.options.callbacks.progress;
                break;
            case 'error':
                currentCallback = this.options.callbacks.error;
                break;
            default :
                console.error('type: ' + type + ' not supported! Use complete, progress and error.');
        }

        var data = {
            nativeEvent: event,
            url: this.url,
            image: this.image
        };

        if(type === 'progress') {
            data.progress = this._progress;
        }

        if(typeof currentCallback === 'function') {
            currentCallback(data)
        }
    };


    /**
     *
     * @param event
     * @private
     */
    ImgLoadingIndicator.prototype._onComplete = function(event) {
        this.image.setAttribute('src', this.url);
        this.image.setAttribute('data-image-loading-success', 'true');

        this._removeIndicator();
        this._callbacksController('complete', event);
    };


    /**
     *
     * @param event
     * @private
     */
    ImgLoadingIndicator.prototype._onProgress = function(event) {
        /** @namespace event.lengthComputable */
        if (!event.lengthComputable) {
            return;
        }

        /** @namespace event.total */
        /** @namespace event.loaded */
        this._progress = parseInt((event.loaded / event.total).toFixed(2) * 100);
        this._callbacksController('progress', event);

        if(this._percent != null) {
            this._updateLoadPercentage();
        }

    };


    /**
     *
     * @param event
     * @private
     */
    ImgLoadingIndicator.prototype._onError = function(event) {
        this._callbacksController('error', event);
    };



    window.ImgLoadingIndicator = ImgLoadingIndicator;


})();