<template>

    <div class="uk-panel uk-placeholder uk-placeholder-large uk-text-center uk-visible-hover" v-if="!video.src">

        <img width="60" height="60" alt="{{ 'Placeholder Video' | trans }}" v-attr="src: $url('app/system/assets/images/placeholder-video.svg')">
        <p class="uk-text-muted uk-margin-small-top">{{ 'Add Video' | trans }}</p>

        <a class="uk-position-cover" v-on="click: config()"></a>

        <div class="uk-panel-badge pk-panel-badge uk-hidden">
            <ul class="uk-subnav pk-subnav-icon">
                <li><a class="pk-icon-delete pk-icon-hover" title="{{ 'Delete' | trans }}" data-uk-tooltip="{delay: 500}" v-on="click: remove()"></a></li>
            </ul>
        </div>

    </div>

    <div class="uk-overlay uk-overlay-hover uk-visible-hover" v-if="video.src">

        <img class="uk-width-1-1" v-attr="src: imageSrc" v-if="imageSrc">
        <video class="uk-width-1-1" v-attr="src: videoSrc" v-if="videoSrc"></video>

        <div class="uk-overlay-panel uk-overlay-background uk-overlay-fade"></div>

        <a class="uk-position-cover" v-on="click: config()"></a>

        <div class="uk-panel-badge pk-panel-badge uk-hidden">
            <ul class="uk-subnav pk-subnav-icon">
                <li><a class="pk-icon-delete pk-icon-hover" title="{{ 'Delete' | trans }}" data-uk-tooltip="{delay: 500}" v-on="click: remove()"></a></li>
            </ul>
        </div>

    </div>

</template>

<script>

    module.exports = {

        props: ['index'],

        data: function() {
            return {imageSrc: undefined, videoSrc: undefined};
        },

        watch: {
            'video.src': {
                handler: 'update',
                immediate: true
            }
        },

        computed: {

            video: function() {
                return this.$parent.videos[this.index] || {};
            }

        },

        methods: {

            config: function() {
                this.$parent.openModal(this.video);
            },

            remove: function() {
                this.video.replace('');
            },

            update: function (src) {

                var matches;

                this.$set('imageSrc', undefined);
                this.$set('videoSrc', undefined);

                if (matches = (src.match(/(?:\/\/.*?youtube\.[a-z]+)\/watch\?v=([^&]+)&?(.*)/) || src.match(/youtu\.be\/(.*)/))) {

                    this.imageSrc = '//img.youtube.com/vi/' + matches[1] + '/hqdefault.jpg';

                } else if (src.match(/(\/\/.*?)vimeo\.[a-z]+\/([0-9]+).*?/)) {

                    var id = btoa(src);

                    if (this.$session[id]) {

                        this.imageSrc = this.$session[id];

                    } else {

                        this.$http.get('http://vimeo.com/api/oembed.json', {url: src}, function (data) {

                            this.imageSrc = this.$session[id] = data.thumbnail_url;

                        });

                    }

                } else {

                    this.videoSrc = this.$url(src);

                }

            }

        }

    };

</script>
