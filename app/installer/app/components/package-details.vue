<template>

    <div class="uk-modal-header uk-flex uk-flex-middle">
        <img class="uk-margin-right" width="50" height="50" alt="{{ package.title }}" v-attr="src: package | icon" v-if="package.extra.icon">
        <div class="uk-flex-item-1">
            <h2 class="uk-margin-small-bottom">{{ package.title }}</h2>
            <ul class="uk-subnav uk-subnav-line uk-margin-bottom-remove">
                <li class="uk-text-muted">{{ package.authors[0].name }}</li>
                <li class="uk-text-muted">{{ 'Version %version%' | trans {version:package.version} }}</li>
            </ul>
        </div>
    </div>

    <div class="uk-alert uk-alert-danger" v-show="messages.checksum">
        {{ 'The checksum of the uploaded package does not match the one from the marketplace. The file might be manipulated.' | trans }}
    </div>

    <div class="uk-alert" v-show="messages.update">
        {{ 'There is an update available for the uploaded package. Please consider installing it instead.' | trans }}
    </div>

    <p>{{ package.description }}</p>

    <ul class="uk-list">
        <li v-if="package.license"><strong>{{ 'License:' | trans }}</strong> {{ package.license }}</li>
        <li v-if="package.authors[0].homepage"><strong>{{ 'Homepage:' | trans }}</strong> <a href="{{ package.authors[0].homepage }}" target="_blank">{{ package.authors[0].homepage }}</a></li>
        <li v-if="package.authors[0].email"><strong>{{ 'Email:' | trans }}</strong> <a href="mailto:{{ package.authors[0].email }}">{{ package.authors[0].email }}</a></li>
    </ul>

    <img width="800" height="600" alt="{{ package.title }}" v-attr="src: package | image" v-if="package.extra.image">

</template>

<script>

    var Version = require('../lib/version');

    module.exports = {

        mixins: [
            require('../lib/package')
        ],

        props: ['api', 'package'],

        data: function () {
            return {
                api: '',
                package: {},
                messages: {}
            };
        },

        filters: {

            icon: function (pkg) {

                var extra = pkg.extra || {};

                if (!extra.icon) {
                    return this.$url('app/system/assets/images/placeholder-icon.svg');
                } else if (!extra.icon.match(/^(https?:)?\//)) {
                    return pkg.url + '/' + extra.icon;
                }

                return extra.icon;
            },

            image: function (pkg) {

                var extra = pkg.extra || {};

                if (!extra.image) {
                    return this.$url('app/system/assets/images/placeholder-image.svg');
                } else if (!extra.image.match(/^(https?:)?\//)) {
                    return pkg.url + '/' + extra.image;
                }

                return extra.image;
            }

        },

        watch: {

            package: function () {

                if (!this.package.name) {
                    return;
                }

                if (_.isArray(this.package.authors)) {
                    this.package.$add('author', this.package.authors[0]);
                }

                this.$set('messages', {});

                this.queryPackage(this.package, function (data) {

                    var version = this.package.version, pkg = data.versions[version];

                    // verify checksum
                    if (pkg && this.package.shasum) {
                        this.messages.$set('checksum', pkg.dist.shasum != this.package.shasum);
                    }

                    // check version
                    _.each(data.versions, function (pkg) {
                        if (Version.compare(pkg.version, version, '>')) {
                            version = pkg.version;
                        }
                    });

                    this.messages.$set('update', version != this.package.version);
                });
            }

        }

    }

</script>
