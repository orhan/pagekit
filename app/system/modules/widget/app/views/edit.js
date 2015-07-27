module.exports = {

    data: function () {
        return _.extend({}, window.$data);
    },

    ready: function () {

        UIkit.tab(this.$$.tab, {connect: this.$$.content});
        // this.$set('widget.data', _.defaults({}, this.widget.data, this.type.defaults));

        // set position from get param
        if (!this.widget.id) {
            var match = RegExp('[?&]position=([^&]*)').exec(location.search);
            this.widget.position = (match && decodeURIComponent(match[1].replace(/\+/g, ' '))) || '';
        }
    },

    computed: {

        sections: function () {

            var sections = [], options;

            _.forIn(this.$options.components, function (component) {

                options = component.options || {};

                if (options.section) {
                    sections.push(options.section);
                }

            });

            return sections;
        },

        positionOptions: function () {
            return [{text: this.$trans('- Assign -'), value: ''}].concat(
                _.map(this.theme.positions, function (position) {
                    return {text: this.$trans(position.label), value: position.name};
                }, this)
            );
        }

    },

    methods: {

        save: function (e) {

            e.preventDefault();

            if (!this.widget.title) {
                UIkit.notify(this.$trans('Please define a widget title'), 'danger');
                return;
            }

            this.$broadcast('save', {widget: this.widget});
            this.$resource('api/site/widget/:id').save({id: this.widget.id}, {widget: this.widget}, function (data) {
                this.$dispatch('saved');

                if (!this.widget.id) {
                    window.history.replaceState({}, '', this.$url('admin/site/widget/edit', {id: data.widget.id}))
                }

                this.$set('widget', data.widget);

                UIkit.notify(data.message);
            }, function (data) {
                UIkit.notify(data, 'danger');
            });
        },

        cancel: function (e) {
            e.preventDefault();

            this.$dispatch('cancel');
        }

    },

    filters: {

        active: function (sections) {
            return sections.filter(function (section) {
                return !section.active || this.widget.type.match(section.active);
            }, this);
        }

    },

    mixins: [window.Widgets]

};

jQuery(function () {

    (new Vue(module.exports)).$mount('#widget-edit');

});
